import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UserRole } from '@prisma/client';
import { UserRole } from '../admin/dto/create-admin.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filter?: { [key: string]: any };
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        filter = {},
      } = query || {};

      const where: any = {
        role: { in: [UserRole.USER_FIZ, UserRole.USER_FIZ] },
        ...filter,
      };

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search, mode: 'insensitive' } },
        ];
      }

      const data = await this.prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          region: true,
          companies: true,
          sessions: true,
          order: true,
          basket: true,
          contact: true,
          comment: true
        },
        omit: {
          password: true,
          refreshToken: true,
        }
      });

      const total = await this.prisma.user.count({ where });

      // if (!data.length) {
      //   throw new NotFoundException('No users found!');
      // }

      return {
        // message: 'Users fetched successfully!',
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
        data,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          region: true,
          companies: true,
          sessions: true,
          order: true,
          basket: true,
          contact: true,
          comment: true
        },
        omit: { password: true, refreshToken: true },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      return { data: user };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, userId: string, userRole: UserRole) {
    try {

      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      if (user.id !== userId) {
        if (['ADMIN'].includes(userRole) === false) {
          throw new ForbiddenException('Access denied!You are not allowed to update this user!');
        }
      }

      const { firstName, lastName, regionId, status, company } = updateUserDto;

      if (status && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        throw new ForbiddenException('Only admins can update user status!');
      }

      if (regionId) {
        const region = await this.prisma.region.findUnique({
          where: { id: regionId },
        });
        if (!region) {
          throw new NotFoundException('Region not found with the provided regionId!');
        }
      }

      if (company && userRole !== 'USER_FIZ') {
        throw new ForbiddenException(
          'Only company users can update their company!',
        )
      }

      // company comes as an object

      let updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          firstName,  
          lastName,
          regionId,
          status: status || user.status,
        },
      });

      if (!updatedUser) {
        throw new BadRequestException('Error updating user!');
      }


      if ( company) { 
        let foundCompany = await this.prisma.company.findFirst({
          where: {
            ownerId: user.id,
          },
        });

        if (!foundCompany) {
          throw new NotFoundException('Company not found!');
        }

        let updatedCompany = await this.prisma.company.update({
          where: { id: foundCompany.id },
          data: company,
        });

        updatedUser['company'] = updatedCompany

       }

      let newUser = {  
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        region: updatedUser.regionId,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        company: (updatedUser as any).company
      }; 

      return { data: newUser };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      if (user.id !== userId) {
        if (['ADMIN'].includes(userRole) === false) {
          throw new ForbiddenException('Access denied!You are not allowed to delete this user!');
        }
      }

      let deletedUser = await this.prisma.user.delete({ where: { id } });

      if (!deletedUser) {
        throw new BadRequestException('Error deleting user!');
      }

      deletedUser  = { ...deletedUser, password: 'XXX', refreshToken: 'XXX'};

      return { data: deletedUser };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof NotFoundException) {
      throw error;
    }
    if (error instanceof ForbiddenException) {
      throw error;
    }
    if (error instanceof ConflictException) {
      throw error;
    }
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
}
