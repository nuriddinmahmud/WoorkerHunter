import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDTO,
  LoginDTO,
  SendOtpDto,
  ActivateDto,
  VerifyOTPDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto/create-auth.dto';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Roles } from 'src/guard/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { UserRole } from 'src/admin/dto/create-admin.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() createAuthDto: RegisterDTO) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with phone ' })
  login(@Body() loginDto: LoginDTO, @Req() req: Request) {
    return this.authService.login(loginDto, req);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP' })
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and activate the user account' })
  activateAccount(@Body() activateDto: ActivateDto) {
    return this.authService.activateAccount(activateDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify the provided OTP' })
  verifyOtp(@Body() verifyDto: VerifyOTPDto) {
    return this.authService.verifyOtp(verifyDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password using phone number and new password' })
  resetPassword(@Body() resetDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate new access token using refresh token' })
  refreshToken(@Body() tokenDto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refreshToken(tokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and remove refresh token and session from user' })
  logout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get authenticated user info' })
  me(@Req() req: Request) {
    return this.authService.me(req);
  }

  @Delete('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices (delete all sessions)' })
  async logoutAll(@Req() req: Request) {
    const user = req['user']; 
    return this.authService.logoutAll(user);
  }
  

  @Delete('session/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER_FIZ, UserRole.USER_YUR, UserRole.VIEWER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete session by ID (Admin or session owner)' })
  @ApiParam({ name: 'id', type: String, description: 'Session ID' })
  deleteSession(@Param('id') id: string, @Req() req: Request) {
    return this.authService.deleteSession(id, req['user']);
  }

  @Get('my-sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER_FIZ, UserRole.USER_YUR, UserRole.VIEWER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sessions for the authenticated user' })
  async mySessions(@Req() req: Request) {
    return this.authService.mySessions(req['user']);
  }

}
