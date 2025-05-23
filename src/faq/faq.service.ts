import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFaqDto: CreateFaqDto) {
    try {
      const data = await this.prisma.fAQ.create({
        data: createFaqDto,
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
    sortBy?: keyof typeof this.prisma.fAQ.fields;
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
          { questionUz: { contains: search, mode: 'insensitive' } },
          { questionRu: { contains: search, mode: 'insensitive' } },
          { questionEn: { contains: search, mode: 'insensitive' } },
          { answerUz: { contains: search, mode: 'insensitive' } },
          { answerRu: { contains: search, mode: 'insensitive' } },
          { answerEn: { contains: search, mode: 'insensitive' } },
        ];
      }

      const data = await this.prisma.fAQ.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.fAQ.count({ where });

      // if (!data.length) {
      //   throw new NotFoundException('No FAQs found!');
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
      const data = await this.prisma.fAQ.findUnique({ where: { id } });

      if (!data) {
        throw new NotFoundException("FAQ not found with the provided 'id'!");
      }

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    try {
      const existing = await this.prisma.fAQ.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException("FAQ not found with the provided 'id'!");
      }

      const data = await this.prisma.fAQ.update({
        where: { id },
        data: updateFaqDto,
      });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.fAQ.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException("FAQ not found with the provided 'id'!");
      }

      const data = await this.prisma.fAQ.delete({ where: { id } });

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
