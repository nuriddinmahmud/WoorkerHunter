import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException, HttpException } from '@nestjs/common';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSizeDto: CreateSizeDto) {
    try {
      const existing = await this.prisma.size.findFirst({
        where: { nameUz: createSizeDto.nameUz },
      });

      if (existing) {
        throw new ConflictException('Size already exists with this name!');
      }

      const data = await this.prisma.size.create({
        data: createSizeDto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

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
      } = query;

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

      const data = await this.prisma.size.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.size.count({ where });


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

  async findOne(id: string) {
    try {
      const data = await this.prisma.size.findUnique({
        where: { id },
      });

      if (!data) {
        throw new NotFoundException("Size not found with the provided 'id'!");
      }

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    try {
      const size = await this.prisma.size.findUnique({ where: { id } });
      if (!size) {
        throw new NotFoundException("Size not found with the provided 'id'!");
      }

      if (updateSizeDto.nameUz) {
        const existing = await this.prisma.size.findFirst({
          where: {
            nameUz: updateSizeDto.nameUz,
            NOT: { id },
          },
        });

        if (existing) {
          throw new ConflictException('Size with this name already exists!');
        }
      }

      const data = await this.prisma.size.update({
        where: { id },
        data: updateSizeDto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const size = await this.prisma.size.findUnique({ where: { id } });

      if (!size) {
        throw new NotFoundException("Size not found with the provided 'id'!");
      }

      const data = await this.prisma.size.delete({ where: { id } });

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
