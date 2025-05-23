import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSiteMetadataDto } from './dto/create-sitemetadata.dto';
import { UpdateSiteMetadataDto } from './dto/update-sitemetadata.dto';

@Injectable()
export class SiteMetadataService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSiteMetadataDto) {
    try {
      const existing = await this.prisma.siteMetadata.findFirst();
      if (existing) {
        throw new ConflictException('Site metadata already exists');
      }

      const data = await this.prisma.siteMetadata.create({ data: dto });

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.siteMetadata.findMany();
      if (!data.length) {
        throw new NotFoundException('No site metadata found!');
      }

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateSiteMetadataDto) {
    try {
      const metadata = await this.prisma.siteMetadata.findUnique({ where: { id } });
      if (!metadata) {
        throw new NotFoundException('Site metadata not found with the provided ID!');
      }

      const data = await this.prisma.siteMetadata.update({
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
      const metadata = await this.prisma.siteMetadata.findUnique({ where: { id } });
      if (!metadata) {
        throw new NotFoundException('Site metadata not found with the provided ID!');
      }

      const data = await this.prisma.siteMetadata.delete({ where: { id } });

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
