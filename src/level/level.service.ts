import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLevelDto: CreateLevelDto) {
    try {
      const existing = await this.prisma.level.findFirst({
        where: { nameUz: createLevelDto.nameUz },
      });

      if (existing) {
        throw new ConflictException('Level already exists with this name!');
      }

      const data = await this.prisma.level.create({
        data: createLevelDto,
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
    sortBy?: keyof typeof this.prisma.level.fields;
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

      const where: any = { ...filter };

      if (search) {
        where.OR = [
          { nameUz: { contains: search, mode: 'insensitive' } },
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
        ];
      }

      const data = await this.prisma.level.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.level.count({ where });

      // if (!data.length) {
      //   throw new NotFoundException('No levels found!');
      // }

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
      const data = await this.prisma.level.findUnique({
        where: { id },
        include: {
          masterProfessions: true,
          professionLevels: true,
          orderProductLevel: true,
        },
      });

      if (!data) {
        throw new NotFoundException("Level not found with the provided 'id'!");
      }

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    try {
      const level = await this.prisma.level.findUnique({ where: { id } });

      if (!level) {
        throw new NotFoundException("Level not found with the provided 'id'!");
      }

      if (updateLevelDto.nameUz) {
        const existing = await this.prisma.level.findFirst({
          where: {
            nameUz: updateLevelDto.nameUz,
            NOT: { id },
          },
        });

        if (existing) {
          throw new ConflictException('Level with this name already exists!');
        }
      }

      const data = await this.prisma.level.update({
        where: { id },
        data: updateLevelDto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const level = await this.prisma.level.findUnique({ where: { id } });

      if (!level) {
        throw new NotFoundException("Level not found with the provided 'id'!");
      }

      const data = await this.prisma.level.delete({ where: { id } });

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
