import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  RegisterDTO,
  LoginDTO,
  SendOtpDto,
  ActivateDto,
  VerifyOTPDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto/create-auth.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { EskizService } from 'src/eskiz/eskiz.service';
import * as DeviceDetector from 'device-detector-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { totp } from 'otplib';

totp.options = { step: 3600, digits: 6 };

@Injectable()
export class AuthService {
  private ACCESS_SECRET = process.env.ACCESS_SECRET;
  private REFRESH_SECRET = process.env.REFRESH_SECRET;
  private OTP_SECRET = process.env.OTP_SECRET;
  
  private deviceDetector = new DeviceDetector();

  constructor(
    private prisma: PrismaService,
    private eskizService: EskizService,
    private jwtServices: JwtService,
  ) {}
    
  async register(RegisterUser: RegisterDTO) {
    const { phoneNumber, password, regionId, role, company } = RegisterUser;
  
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (existingUser) {
        throw new ConflictException('A user with this phone number already exists!');
      }

      if (role) {
        if ( ['USER_FIZ', 'USER_FIZ'].includes(role) === false) {
          throw new BadRequestException('Invalid role!');
        }
      }
  
      const region = await this.prisma.region.findUnique({
        where: { id: regionId },
      });
      if (!region) {
        throw new NotFoundException('Region not found with the provided regionId!');
      }
  
      if (role === 'USER_FIZ' && !company) {
        throw new BadRequestException('Company details are required for USER_FIZ role.');
      }

      if (role === 'USER_FIZ' && company) {
        throw new BadRequestException('Company details are not required for USER_FIZ role.');
      }
  
      const hashedPassword = await bcrypt.hash(password, 7);

      const newUser = await this.prisma.user.create({
        data: {
          firstName: RegisterUser.firstName,
          lastName: RegisterUser.lastName,
          phoneNumber,
          password: hashedPassword,
          regionId,
          role,
        },
      });
        
      let newCompany = {};
      if (role === 'USER_YUR' && company) {
        newCompany = await this.prisma.company.create({
          data: {
            nameUz: company.nameUz,
            nameRu: company.nameRu,
            nameEn: company.nameEn,
            taxId: company.taxId,
            bankCode: company.bankCode,
            bankAccount: company.bankAccount,
            bankName: company.bankName,
            oked: company.oked,
            address: company.address,
            ownerId: newUser.id,
          },
        });
      }
  
  
      const otp = totp.generate(this.OTP_SECRET + phoneNumber);

      const newData = { id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName, role: newUser.role, regionId: newUser.regionId, phoneNumber: newUser.phoneNumber, status: newUser.status , createdAt: newUser.createdAt, updatedAt: newUser.updatedAt};

      if (role === 'USER_FIZ') {
        newData['company'] = newCompany;
      }
  
      await this.eskizService.sendSMS(otp, phoneNumber);
  
      return {
        otp, 
        data: newData
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'Something went wrong during registration');
    }
  }
  
  async login(loginUser: LoginDTO, req: Request) {
    const { phoneNumber, password } = loginUser;
  
    try {
      const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
  
      if (!user) {
        throw new NotFoundException('User not found with the provided phone number.Please register first!');
      }
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new BadRequestException('Phone number or password is incorrect!');
      }
  
      if (user.status === 'INACTIVE') {
        throw new ForbiddenException('Your account is not active, please activate your account first!');
      }
  
      if (user.status === 'BANNED') {
        throw new ForbiddenException('Your account is banned, please contact support!');
      }
  
      const existingSession = await this.prisma.session.findFirst({
        where: {
          ip: req.ip,
          userId: user.id,
        },
      });
  
      if (!existingSession) {
        const userAgentHeader = req.headers['user-agent'] || '';
        const deviceInfo = this.deviceDetector.parse(userAgentHeader);
  
        await this.prisma.session.create({
          data: {
            userId: user.id,
            ip: req.ip,
            userAgent: userAgentHeader,
            device: deviceInfo.device?.type || null,
            brand: deviceInfo.device?.brand || null,
            model: deviceInfo.device?.model || null,
            os: deviceInfo.os?.name || null,
            osVersion: deviceInfo.os?.version || null,
            client: deviceInfo.client?.name || null,
            clientType: deviceInfo.client?.type || null,
            clientVersion: deviceInfo.client?.version || null,
            isBot: deviceInfo.bot ? true : false,
          },
        });
      }
  
      const payload = { id: user.id, role: user.role, status: user.status };
      const accessToken = this.genAccessToken(payload);
      const refreshToken = this.genRefreshToken(payload);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken },
      });
  
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'Something went wrong during login!');
    }
  }
  
  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phoneNumber } = sendOtpDto;
  
    try {
      const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
  
      if (!user) {
        throw new UnauthorizedException('User not found!');
      }
  
      const otp = totp.generate(this.OTP_SECRET + phoneNumber);
      await this.eskizService.sendSMS(otp, phoneNumber)
  
      return {
        otp,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'Failed to send OTP!');
    }
  }

  async activateAccount(activateDto: ActivateDto) {
    const { phoneNumber, otp } = activateDto;
  
    try {
      const isValid = totp.check(otp, this.OTP_SECRET + phoneNumber);
      
      if (!isValid) {
        throw new UnauthorizedException('Invalid phone number or OTP!');
      }
  
      await this.prisma.user.update({
        where: { phoneNumber },
        data: { status: 'ACTIVE' },
      });
  
      return { message: 'Account successfully activated!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'Activation failed!');
    }
  }

  async verifyOtp(verifyOTP: VerifyOTPDto) {
    const { phoneNumber, otp } = verifyOTP;
  
    try {
      const isValid = totp.check(otp, this.OTP_SECRET + phoneNumber);
  
      if (!isValid) {
        throw new UnauthorizedException('Invalid phone number or OTP!');
      }
  
      return { message: 'OTP  successfully!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'OTP verification failed!');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { phoneNumber, newPassword } = resetPasswordDto;
  
    try {
      const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
  
      if (!user) {
        throw new NotFoundException('User with this phone number does not exist!');
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 7);
  
      await this.prisma.user.update({
        where: { phoneNumber },
        data: { password: hashedPassword },
      });
  
      return { message: 'Password successfully updated!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'Password update failed!');
    }
  }
  
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
  
    try {
      const payload = await this.jwtServices.verifyAsync(refreshToken, {
        secret: this.REFRESH_SECRET,
      });
  
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });
  
      if (!user) {
        throw new NotFoundException('User not found!');
      }
  
      if (user.status === 'INACTIVE') {
        throw new ForbiddenException('User account is not active!');
      }

      if (user.status === 'BANNED') {
        throw new ForbiddenException('User account is BANNED!');
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token!');
      }
  
      const newAccessToken = this.genAccessToken({
        id: user.id,
        role: user.role,
        status: user.status,
      });
  
      return { accessToken: newAccessToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
  
      throw new UnauthorizedException('Invalid or expired refresh token!');
    }
  }
  
  async logout(req: Request) {
    const user = req['user'];
  
    try {
      await this.prisma.$transaction([
        this.prisma.session.deleteMany({
          where: {
            ip: req.ip,
            userId: user.id,
          },
        }),
        this.prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: null },
        }),
      ]);
  
      return { data: 'Logged out successfully!' };
    } catch (error) {
      throw new BadRequestException(error?.message || 'Something went wrong during logout!');
    }
  }
  
  async me(req: Request) {
    const user = req['user'];
    const userId = user.id;
    const userRole = user.role;
  
    try {
      const session = await this.prisma.session.findFirst({
        where: {
          userId: user.id,
          ip: req.ip,
        },
      });
  
      if (!session) {
        throw new UnauthorizedException('You are logged out! Please log in again.');
      }

      let data;
  
      if ( userRole === 'USER_FIZ' || userRole === 'USER_YUR') {
        data = await this.prisma.user.findUnique({
          where: { id: user.id },
          omit: { password: true, refreshToken: true },
          include: {
            region: true,
            companies: true,
            sessions: true,
            order: true,
            basket: true,
            contact: true,
            comment: true,
          },
        });
      }
  
      if ( userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'VIEWER_ADMIN') {
        data = await this.prisma.user.findUnique({
          where: { id: user.id },
          omit: { password: true, refreshToken: true },
          include: {
            region: true,
            sessions: true,
          },
        });
      }
      if (!data) {
        throw new NotFoundException('User not found!');
      }
  
      return { data };
    } catch (error) {
      throw new BadRequestException(error?.message || 'Something went wrong!');
    }
  }


  async deleteSession(sessionId: string, user: any) {
    try {
      const session = await this.prisma.session.findUnique({
        where: { id: sessionId },
      });
  
      if (!session) {
        throw new NotFoundException('Session not found!');
      }
  
      const userId = user.id;
      const userRole = user.role;
  
      if (session.userId !== userId && !['ADMIN'].includes(userRole)) {
        throw new ForbiddenException('You do not have permission to delete this session!');
      }
  
      await this.prisma.session.delete({
        where: { id: sessionId },
      });
  
      return { message: 'Session deleted successfully!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'Failed to delete session!');
    }
  }

  async mySessions(user: any) {
    try {
      const sessions = await this.prisma.session.findMany({
        where: { userId: user.id },
        orderBy: {
          createdAt: 'desc', 
        },
      });
  
      if (!sessions.length) {
        throw new NotFoundException('No sessions found for this user!');
      }
  
      return { data: sessions };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error?.message || 'Failed to fetch sessions!');
    }
  }

  async logoutAll(user: any) {
    try {
      await this.prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
  
      return { message: 'Successfully logged out from all devices' };
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to logout from all sessions');
    }
  }
  
  
  
  genAccessToken(payload: any) {
    
    return this.jwtServices.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: '12h',
    });
  }

  genRefreshToken(payload: any) {
    return this.jwtServices.sign(payload, {
      secret: this.REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
}
