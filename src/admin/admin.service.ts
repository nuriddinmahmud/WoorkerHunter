import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddAdminDto } from './dto/create-admin.dto';
import { UserRole } from './dto/create-admin.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async addAdmin(addAdminDto: AddAdminDto) {
    try {
      const existingAdmin = await this.prisma.user.findUnique({
        where: { phoneNumber: addAdminDto.phoneNumber },
      });

      if (existingAdmin) {
        throw new ConflictException('Admin or user already exists with this phone number!');
      }

      const region = await this.prisma.region.findUnique({
        where: { id: addAdminDto.regionId },
      });
      if (!region) {
        throw new NotFoundException('Region not found with the provided regionId!');
      }

      const hashedPassword = await bcrypt.hash(addAdminDto.password, 7);

      const newAdmin = await this.prisma.user.create({
        data: {
          firstName: addAdminDto.firstName,
          lastName: addAdminDto.lastName,
          phoneNumber: addAdminDto.phoneNumber,
          password: hashedPassword,
          regionId: addAdminDto.regionId,
          role: addAdminDto.role as UserRole,
          status: 'ACTIVE',
        },
      });

      const admin = { id: newAdmin.id, firstName: newAdmin.firstName, lastName: newAdmin.lastName, role: newAdmin.role, regionId: newAdmin.regionId, phoneNumber: newAdmin.phoneNumber, status: newAdmin.status , createdAt: newAdmin.createdAt, updatedAt: newAdmin.updatedAt};

      return { admin };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException(error?.message || 'Failed to create admin');
    }
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: keyof typeof this.prisma.user.fields;
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
        role: {
          in: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN],
        },
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
        omit: { password: true, refreshToken: true },
      });

      const total = await this.prisma.user.count({ where });

      return {
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

  async deleteAdmin(id: string) {
    try {
      const adminToDelete = await this.prisma.user.findUnique({ where: { id } });
      if (!adminToDelete) throw new NotFoundException('Admin not found!');

      let deletedAdmin = await this.prisma.user.delete({ where: { id } });

      if (!deletedAdmin) {
        throw new BadRequestException('Failed to delete admin');
      }

      const admin = { ...deletedAdmin, password: 'XXX', refreshToken: 'XXX' };

      return { admin: deletedAdmin };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message || 'Failed to delete admin');
    }
  }

  private handleError(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
}
