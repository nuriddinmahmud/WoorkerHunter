import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCapacityDto: CreateCapacityDto) {
    try {
      const existing = await this.prisma.capacity.findFirst({
        where: { nameUz: createCapacityDto.nameUz },
      });

      if (existing) {
        throw new ConflictException('Capacity with this name already exists!');
      }

      const data = await this.prisma.capacity.create({
        data: createCapacityDto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: keyof typeof this.prisma.capacity.fields;
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
        ...filter,
      };

      if (search) {
        where.OR = [
          { nameUz: { contains: search, mode: 'insensitive' } },
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
        ];
      }

      const data = await this.prisma.capacity.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.capacity.count({ where });

      // if (!data.length) {
      //   throw new NotFoundException('No capacity records found!');
      // }

      return {
        // message: 'Capacity list fetched successfully!',
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
      const data = await this.prisma.capacity.findUnique({ where: { id } });

      if (!data) {
        throw new NotFoundException("Capacity not found with the provided 'id'!");
      }

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateCapacityDto: UpdateCapacityDto) {
    try {
      const existing = await this.prisma.capacity.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException("Capacity not found with the provided 'id'!");
      }

      if (updateCapacityDto.nameUz) {
        const duplicate = await this.prisma.capacity.findFirst({
          where: {
            nameUz: updateCapacityDto.nameUz,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ConflictException('Another capacity with this name already exists!');
        }
      }

      const data = await this.prisma.capacity.update({
        where: { id },
        data: updateCapacityDto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.capacity.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException("Capacity not found with the provided 'id'!");
      }

      const data = await this.prisma.capacity.delete({ where: { id } });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
}