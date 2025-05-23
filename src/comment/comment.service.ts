import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserRole } from '../guard/role-enum';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto, userId: string, userRole: UserRole) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
        include: { masters: true },
      });
      if (!order) {
        throw new NotFoundException('Order not found.');
      }
      if (order.ownerId !== userId) {
        throw new BadRequestException('You are not authorized to comment on this order.');
      }
      if (order.status !== 'COMPLETED') {
        throw new BadRequestException('Only completed orders can be commented on.');
      }

      const masterIds = dto.masterRatings.map(rating => rating.masterId);
      const validMasters = await this.prisma.master.findMany({
        where: { id: { in: masterIds } },
      });
      if (validMasters.length !== masterIds.length) {
        throw new BadRequestException('One or more master IDs are invalid.');
      }

      const comment = await this.prisma.comment.create({
        data: {
          message: dto.message,
          userId: userId,
          orderId: dto.orderId,
        },
      });

      const masterRatingData = dto.masterRatings.map(rating => ({
        star: rating.star,
        masterId: rating.masterId,
        commentId: comment.id,
      }));
      const createdRating = await this.prisma.masterRatings.createMany({ data: masterRatingData });

      if ( createdRating.count !== masterRatingData.length) {
        throw new BadRequestException('Failed to create master ratings.');
      }

      comment['masterRatings'] = createdRating;

      return { data: comment };
    } catch (error) {
      this.handleError(error);
    }
  }

  // async findAll(userId?: string, userRole?: string) {
  //   try {
  //     const where: any = {};
  //     if (userRole !== UserRole.ADMIN && userId) {
  //       where.userId = userId; 
  //     }

  //     const comments = await this.prisma.comment.findMany({
  //       where,
  //       include: { MasterRatings: true },
  //     });

  //     // if (!comments.length) {
  //     //   throw new NotFoundException('Comments not found.');
  //     // }

  //     return comments;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  async findAll(
    userId?: string,
    userRole?: string,
    page: number = 1, // Default to page 1
    limit: number = 10, // Default to 10 items per page
    sortBy: 'createdAt' | 'updatedAt' = 'createdAt', // Default sort by createdAt
    sortOrder: 'asc' | 'desc' = 'desc', // Default sort order is descending
  ) {
    try {
      const where: any = {};
      if (userRole !== UserRole.ADMIN && userId) {
        where.userId = userId; 
      }
  
      // Pagination parameters
      const skip = (page - 1) * limit;
      const take = limit;
  
      // Sorting parameters
      const orderBy = {
        [sortBy]: sortOrder, // Dynamically set sortBy and sortOrder
      };
  
      const comments = await this.prisma.comment.findMany({
        where,
        include: { MasterRatings: true },
        skip, // Skip records based on pagination
        take, // Limit the number of records returned
        orderBy, // Apply sorting
      });
  
      // Count total records for pagination metadata
      const total = await this.prisma.comment.count({ where });
  
      return {
        data: comments,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string, userId?: string, userRole?: string) {
    try {
      const where: any = { id };
      if (userRole !== UserRole.ADMIN && userId) {
        where.userId = userId; 
      }

      const comment = await this.prisma.comment.findUnique({
        where,
        include: { MasterRatings: true },
      });

      if (!comment) {
        throw new NotFoundException('Comment not found.');
      }

      return comment;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateCommentDto) {
    try {

      const existing = await this.prisma.comment.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Comment not found.');
      }

      if (dto.masterRatings?.length) {

        // const masterIds = dto.masterRatings?.map(rating => rating.masterId);
        // const masterIds = dto.masterRatings?.filter(Boolean).map(rating => rating.masterId);

        const masterIds = dto.masterRatings?.filter(Boolean).map(rating => rating.masterId).filter(id => id !== undefined);
        const validMasters = await this.prisma.master.findMany({
          where: { id: { in: masterIds } },
        });
 
        if (validMasters.length !== masterIds.length) {
          throw new BadRequestException('One or more master IDs are invalid.');
        }

        const masterRatingData = dto.masterRatings.map(rating => ({
          id: rating.masterId,
          star: rating.star,
        }));

        await Promise.all(
          masterRatingData.map(async (rating) => {
            await this.prisma.masterRatings.update({
              where: { id: rating.id },
              data: { star: rating.star },
            });
          }),
        );
      }

      const updated = await this.prisma.comment.update({
        where: { id },
        data: { message: dto.message },
      });

      return { data: updated };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string, userId?: string, userRole?: string) {
    const isAdmin = userRole === UserRole.ADMIN;
    try {
      const existing = await this.prisma.comment.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Comment not found.');
      }

      if (!isAdmin && existing.userId !== userId) {
        throw new BadRequestException('You are not authorized to delete this comment.');
      }

      const data = await this.prisma.comment.delete({ where: { id } });
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