import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}

  private generateUniqueCode(): string {
    return Date.now().toString().slice(-6);
  }

  async create(dto: CreateToolDto) {
    try {
      const code = this.generateUniqueCode();

      const toolExists = await this.prisma.tool.findUnique({ where: { code } });
      if (toolExists) throw new ConflictException('Tool code already exists!');

      if (dto.brandId) {
        const brandExists = await this.prisma.brand.findUnique({ where: { id: dto.brandId } });
        if (!brandExists) throw new NotFoundException('Brand not found');
      }
      if (dto.capacityId) {
        const capacityExists = await this.prisma.capacity.findUnique({ where: { id: dto.capacityId } });
        if (!capacityExists) throw new NotFoundException('capacity not found');
      }
      if (dto.sizeId) {
        const sizeExists = await this.prisma.size.findUnique({ where: { id: dto.sizeId } });
        if (!sizeExists) throw new NotFoundException('Size not found');
      }

      const data = await this.prisma.tool.create({ data: { ...dto, code } });
      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(query: any) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        filter = {},
      } = query;

      const where: any = { ...filter };

      if (search) {
        where.OR = [
          { nameUz: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ];
      }

      const data = await this.prisma.tool.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: +limit,
        include: {
          brand: true,
          capacity: true,
          size: true,
        },
      });

      const total = await this.prisma.tool.count({ where });

      // if (!data.length) throw new NotFoundException('No tools found!');

      return {
        // message: 'Tools fetched successfully!',
        meta: { total, page, lastPage: Math.ceil(total / limit) },
        data,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.tool.findUnique({
        where: { id },
        include: {
          brand: true,
          capacity: true,
          size: true,
        },
      });

      if (!data) throw new NotFoundException('Tool not found!');

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateToolDto) {
    try {
      const tool = await this.prisma.tool.findUnique({ where: { id } });
      if (!tool) throw new NotFoundException('Tool not found!');

      if (dto.brandId) {
        const brandExists = await this.prisma.brand.findUnique({ where: { id: dto.brandId } });
        if (!brandExists) throw new NotFoundException('Brand not found');
      }
      if (dto.capacityId) {
        const capacityExists = await this.prisma.capacity.findUnique({ where: { id: dto.capacityId } });
        if (!capacityExists) throw new NotFoundException('capacity not found');
      }
      if (dto.sizeId) {
        const sizeExists = await this.prisma.size.findUnique({ where: { id: dto.sizeId } });
        if (!sizeExists) throw new NotFoundException('Size not found');
      }

      if (dto.img && dto.img !== tool.img) {
        const oldImgPath = path.join('uploads', tool.img);
        if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
      }

      if ( dto.price) {
        await this.prisma.basket.deleteMany({ where: { toolId: id } });
      }

      const data = await this.prisma.tool.update({
        where: { id },
        data: dto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const tool = await this.prisma.tool.findUnique({ where: { id } });
      if (!tool) throw new NotFoundException('Tool not found!');

      const oldPath = path.join('..', '..', 'uploads', tool.img);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      const oldImgPath = path.join('uploads', tool.img);
      if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);

      const data = await this.prisma.tool.delete({ where: { id } });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof HttpException) throw error;
    throw new BadRequestException(error.message);
  }
}
