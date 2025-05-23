import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
// import { UserRole } from '@prisma/client';
import { UserRole } from '../admin/dto/create-admin.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto, userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found!');

      const data = await this.prisma.contact.create({
        data: { ...dto, userId },
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(query: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
  }, userId: string, userRole: string) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        ...filters
      } = query;

      const where: any = { ...filters };

      const isAdmin = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN || userRole === UserRole.VIEWER_ADMIN;

      if (!isAdmin && userId) {
        where.userId = userId; 
      }

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search, mode: 'insensitive' } },
        ];
      }

      const data = await this.prisma.contact.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        include: { user: { omit: { password: true, refreshToken: true } } },
        skip: (+page - 1) * +limit,
        take: +limit,
      });

      const total = await this.prisma.contact.count({ where });

      return {
        meta: {
          total,
          page: +page,
          lastPage: Math.ceil(total / +limit),
        },
        data,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
        include: { user: { omit: { password: true, refreshToken: true } } },
      });

      if (!contact) throw new NotFoundException('Contact not found!');

      if ( contact.userId !== userId) {
        if ( ['ADMIN', 'SUPER_ADMIN', 'VIEWER_ADMIN'].includes(userRole) === false) throw new ForbiddenException('Access denied! You are not allowed to view this contact')
      }

      return { data: contact };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateContactDto) {
    try {
      const contact = await this.prisma.contact.findUnique({ where: { id } });
      if (!contact) throw new NotFoundException('Contact not found!');

      const updated = await this.prisma.contact.update({
        where: { id },
        data: dto,
      });

      return { data: updated };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const contact = await this.prisma.contact.findUnique({ where: { id } });
      if (!contact) throw new NotFoundException('Contact not found!');

      const deleted = await this.prisma.contact.delete({ where: { id } });

      return { data: deleted };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof HttpException) throw error;
    throw new BadRequestException(error.message);
  }
}
