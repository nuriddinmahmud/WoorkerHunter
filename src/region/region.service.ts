import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    try {
      const existing = await this.prisma.region.findFirst({
        where: { nameUz: createRegionDto.nameUz },
      });

      if (existing) {
        throw new ConflictException('Region already exists');
      }

      const data = await this.prisma.region.create({
        data: createRegionDto,
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
    sortBy?: keyof typeof this.prisma.region.fields;
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
  
      const data = await this.prisma.region.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });
  
      const total = await this.prisma.region.count({ where });
  
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
      const data = await this.prisma.region.findUnique({
        where: { id },
        include: { users: true },
      });

      if (!data) {
        throw new NotFoundException("Region not found with the provided 'id'!");
      }

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    try {
      const region = await this.prisma.region.findUnique({ where: { id }});
      if (!region) {
        throw new NotFoundException("Region not found with the provided 'id'!");
      }

      if (updateRegionDto.nameUz) {
        const existing = await this.prisma.region.findFirst({
          where: {
            nameUz: updateRegionDto.nameUz,
            NOT: { id },
          },
        });

        if (existing) {
          throw new ConflictException('Region with this name already exists!');
        }
      }

      const data = await this.prisma.region.update({
        where: { id },
        data: updateRegionDto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const region = await this.prisma.region.findUnique({ where: { id } });

      if (!region) {
        throw new NotFoundException("Region not found with the provided 'id'!");
      }

      const data = await this.prisma.region.delete({ where: { id } });

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
