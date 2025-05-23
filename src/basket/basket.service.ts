import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { UserRole } from '../guard/role-enum';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBasketDto, userId: string, userRole: UserRole) {
    try {

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      if (!dto.professionId && !dto.toolId) {
        throw new BadRequestException(
          'Either professionId or toolId must be provided.',
        );
      }

      if (dto.professionId && dto.toolId) {
        throw new BadRequestException(
          'Only one of professionId or toolId can be provided.',
        );
      }

      if ( dto.toolId && (dto.levelId || dto.timeUnit || dto.workingTime)) {
        throw new BadRequestException(
          'LevelId, timeUnit, and workingTime cannot be provided for tools.',
        );
      }

      // Validate professionId if provided
      if (dto.professionId) {
        const profession = await this.prisma.profession.findUnique({
          where: { id: dto.professionId },
        });
        if (!profession) {
          throw new BadRequestException('Invalid professionId.');
        }
      }

      // Validate toolId if provided
      if (dto.toolId) {

        if (dto.levelId || dto.timeUnit || dto.workingTime) {
          throw new BadRequestException('LevelId, timeUnit and workingTime cannot be provided with toolId.');
        }

        const tool = await this.prisma.tool.findUnique({
          where: { id: dto.toolId },
        });
        if (!tool) {
          throw new BadRequestException('Invalid toolId.');
        }
      }

      // Validate levelId if provided
      if (dto.levelId) {
        const level = await this.prisma.level.findUnique({
          where: { id: dto.levelId },
        });
        if (!level) {
          throw new BadRequestException('Invalid levelId.');
        }
      }

      // Create the basket item
      const basket = await this.prisma.basket.create({
        data: {
          ownerId: userId,
          professionId: dto.professionId,
          toolId: dto.toolId,
          levelId: dto.levelId,
          quantity: dto.quantity,
          timeUnit: dto.timeUnit,
          workingTime: dto.workingTime,
          price: dto.price,
        },
      });

      return { data: basket };
    } catch (error) {
      this.handleError(error);
    }
  }

  // async findAll(userId?: string, userRole?: string) {
  //   const isAdmin = userRole === UserRole.ADMIN;
  //   try {
  //     const where: any = {};
  //     if (!isAdmin && userId) {
  //       where.ownerId = userId; 
  //     }

  //     const baskets = await this.prisma.basket.findMany({
  //       where,
  //       include: {
  //         profession: true,
  //         tool: true,
  //         level: true,
  //       },
  //     });

  //     // if (!baskets.length) {
  //     //   throw new NotFoundException('Basket items not found.');
  //     // }

  //     return baskets;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  async findAll(
    userId?: string,
    userRole?: string,
    page: number = 1, 
    limit: number = 10,     
    sortBy: 'price' | 'createdAt' | 'updatedAt' = 'createdAt',   
    sortOrder: 'asc' | 'desc' = 'desc',    
  ) {
    const isAdmin = userRole === UserRole.ADMIN;
    try {
      const where: any = {};
      if (!isAdmin && userId) {
        where.ownerId = userId; 
      }
  
      // Pagination parameters
      const skip = (page - 1) * limit;
      const take = limit;
  
      // Sorting parameters
      const orderBy = {
        [sortBy]: sortOrder, 
      };
  
      const baskets = await this.prisma.basket.findMany({
        where,
        include: {
          profession: true,
          tool: true,
          level: true,
        },
        skip,
        take,
        orderBy,
      });
  
      // Count total records for pagination metadata
      const total = await this.prisma.basket.count({ where });
  
      return {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          data: baskets,
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string, userId?: string, userRole?: string) {
    const isAdmin = userRole === UserRole.ADMIN;
    try {
      const where: any = { id };
      if (!isAdmin && userId) {
        where.ownerId = userId; 
      }

      const basket = await this.prisma.basket.findUnique({
        where,
        include: {
          profession: true,
          tool: true,
          level: true,
        },
      });

      if (!basket) {
        throw new NotFoundException('Basket item not found.');
      }

      return basket;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateBasketDto, userId?: string, userRole?: string) {
    const isAdmin = userRole === UserRole.ADMIN;
    try {

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const existing = await this.prisma.basket.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Basket item not found.');
      }

      if (!isAdmin && existing.ownerId !== userId) {
        throw new BadRequestException('You are not authorized to update this basket item.');
      }

      if (!dto.professionId && !dto.toolId) {
        throw new BadRequestException(
          'Either professionId or toolId must be provided.',
        );
      }

      if (dto.professionId && dto.toolId) {
        throw new BadRequestException(
          'Only one of professionId or toolId can be provided.',
        );
      }

      // Validate professionId if provided
      if (dto.professionId) {
        const profession = await this.prisma.profession.findUnique({
          where: { id: dto.professionId },
        });
        if (!profession) {
          throw new BadRequestException('Invalid professionId.');
        }
      }

      // Validate toolId if provided
      if (dto.toolId) {

        if (dto.levelId || dto.timeUnit || dto.workingTime) {
          throw new BadRequestException('LevelId, timeUnit and workingTime cannot be provided with toolId.');
        }

        const tool = await this.prisma.tool.findUnique({
          where: { id: dto.toolId },
        });
        if (!tool) {
          throw new BadRequestException('Invalid toolId.');
        }
      }

      // Validate levelId if provided
      if (dto.levelId) {
        const level = await this.prisma.level.findUnique({
          where: { id: dto.levelId },
        });
        if (!level) {
          throw new BadRequestException('Invalid levelId.');
        }
      }

      // Update the basket item
      const updated = await this.prisma.basket.update({
        where: { id },
        data: dto,
      });

      return { data: updated };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string, userId?: string, userRole?: string) {
    const isAdmin = userRole === UserRole.ADMIN;
    try {
      const existing = await this.prisma.basket.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Basket item not found.');
      }

      if (!isAdmin && existing.ownerId !== userId) {
        throw new BadRequestException('You are not authorized to delete this basket item.');
      }

      const data = await this.prisma.basket.delete({ where: { id } });
      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }
    console.error(error);
    throw new Error('Internal server error');
  }
}