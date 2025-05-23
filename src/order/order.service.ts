import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UserRole } from '../guard/role-enum';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { QueryOrderDto } from './dto/search-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService,
  private telegramBotService: TelegramBotService, 
){}


  async create(dto: CreateOrderDto, userId: string) {
    try {
      const { orderProducts, ...body } = dto;

      // Validate orderProducts
      if (!orderProducts?.length) {
        throw new BadRequestException('Order must include at least one product.');
      }

      for (const product of orderProducts) {
        if (product.professionId && product.toolId) {
          throw new BadRequestException(
            'Only one of professionId or toolId can be provided per order product.',
          );
        }
        if (!product.professionId && !product.toolId) {
          throw new BadRequestException(
            'Either professionId or toolId must be provided for each order product.',
          );
        }

        if (product.toolId && (product.levelId || product.timeUnit || product.workingTime)) {
          throw new BadRequestException(
            'LevelId, timeUnit, and workingTime cannot be provided for tools.',
          );
        }
      }

      // Validate professionIds and toolIds and levelIds
      const professionIds = orderProducts
        .filter(op => op.professionId !== undefined)
        .map(op => op.professionId)
        .filter(id => id !== undefined);

      const toolIds = orderProducts
      .filter(op => op.toolId !== undefined)
      .map(op => op.toolId)
      .filter(id => id !== undefined);

      let levelIds = orderProducts
        .filter(op => op.levelId !== undefined)
        .map(op => op.levelId)
        .filter(id => id !== undefined);

      levelIds = Array.from(new Set(levelIds));

      const validProfessions = await this.prisma.profession.findMany({
        where: { id: { in: professionIds } },
      });
      if (validProfessions.length !== professionIds.length) {
        throw new BadRequestException('One or more profession IDs are invalid.');
      }

      const validTools = await this.prisma.tool.findMany({
        where: { id: { in: toolIds } },
      });
      if (validTools.length !== toolIds.length) {
        throw new BadRequestException('One or more tool IDs are invalid.');
      }

      const validLevels = await this.prisma.level.findMany({
        where: { id: { in: levelIds } },
      });
      if (validLevels.length !== levelIds.length) {
        throw new BadRequestException('One or more level IDs are invalid.');
      }

      // Calculate total price
      // let totalPrice = 0;
      // for (const product of orderProducts) {
      //   const price =
      //     product.timeUnit === 'HOURLY'
      //       ? product.workingTime * (product.professionId ? validProfessions.find(p => p.id === product.professionId)?.priceHourly : validTools.find(t => t.id === product.toolId)?.price)
      //       : product.workingTime * (product.professionId ? validProfessions.find(p => p.id === product.professionId)?.priceDaily : validTools.find(t => t.id === product.toolId)?.price);
      //   totalPrice += price * product.quantity;
      // }

      // Create Order record
      const order = await this.prisma.order.create({
        data: {
          ...body,
          ownerId: userId,
        },
      });

      // Create related OrderProduct records
      const orderProductData = orderProducts.map(product => ({
        orderId: order.id,
        professionId: product.professionId,
        toolId: product.toolId,
        levelId: product.levelId,
        quantity: product.quantity,
        timeUnit: product.timeUnit,
        workingTime: product.workingTime,
        price: product.price

      }));
      await this.prisma.orderProduct.createMany({ data: orderProductData });

      const createdOrderProducts = await this.prisma.orderProduct.findMany({
        where: { orderId: order.id },
      });

      order['orderProducts'] = createdOrderProducts;

      if ( createdOrderProducts.length > 0) {
        for (  let i = 0; i < createdOrderProducts.length; i++) {
          if ( createdOrderProducts[i].toolId ) {
            const tool = await this.prisma.tool.findUnique({
              where: { id: createdOrderProducts[i].toolId ?? undefined },
            });
    
            if (tool) {
              if (tool.quantity < createdOrderProducts[i].quantity) {
                throw new BadRequestException(`ID: ${tool.id}, This tool's quantity is not enough for the order.`);
              }
            }
          }
        }

        for (  let i = 0; i < createdOrderProducts.length; i++) {
          if ( createdOrderProducts[i].toolId ) {
            const tool = await this.prisma.tool.findUnique({
              where: { id: createdOrderProducts[i].toolId ?? undefined },
            });

            await this.prisma.tool.update({
              where: { id: tool!.id },
              // data: { quantity: { decrement: createdOrderProducts[i].quantity } }
              data: { quantity: tool!.quantity - createdOrderProducts[i].quantity },
            });
          }
      }
    }

      await this.prisma.basket.deleteMany({ where: { ownerId: userId } });

      this.telegramBotService.notifyNewOrder(order, orderProducts);

      return { data: order };
    } catch (error) {
      this.handleError(error);
    }
  }

  // async findAll(userId?: string, userRole?: string, params: any = {}) {
  //   try {
  //     const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', status } = params;

  //     const where: any = {};
  //     if ((userRole === UserRole.USER_FIZ || userRole === UserRole.USER_FIZ) && userId) {
  //       where.ownerId = userId;
  //     }
  //     if (search) {
  //       where.OR = [
  //         { address: { contains: search, mode: 'insensitive' } },
  //         { deliveryComment: { contains: search, mode: 'insensitive' } },
  //       ];
  //     }
  //     if (status) {
  //       where.status = status;
  //     }

  //     const [data, total] = await this.prisma.$transaction([
  //       this.prisma.order.findMany({
  //         where,
  //         include: { owner: { omit: { password: true, refreshToken: true } }, orderProducts: true, masters: true } as any,
  //         orderBy: { [sortBy]: sortOrder },
  //         skip: (page - 1) * limit,
  //         take: +limit,
  //       }),
  //       this.prisma.order.count({ where }),
  //     ]);

  //     return {
  //       total,
  //       currentPage: +page,
  //       totalPages: Math.ceil(total / +limit),
  //       data,
  //     };
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  async findAll(query: QueryOrderDto, userId?: string, userRole?: string) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'asc',
      sortBy = 'date',
      withDelivery,
      totalSum,
      gteTotalSum,
      lteTotalSum,
      date,
      gteDate,
      lteDate,
      paid,
      paymentType,
      status,
    } = query;

    const filter: any = {};

    if ((userRole === UserRole.USER_FIZ || userRole === UserRole.USER_FIZ) && userId) {
      filter.ownerId = userId;
    }

    if (withDelivery == 'true') filter.withDelivery = true;
    if (withDelivery == 'false') filter.withDelivery = false;

    if (paid == 'true') filter.paid = true;
    if (paid == 'false') filter.paid = false;

    if (paymentType) filter.paymentType = paymentType;
    if (status) filter.status = status;

    if (totalSum || gteTotalSum || lteTotalSum) {
      filter.totalSum = {
        gte: gteTotalSum,
        lte: lteTotalSum,
        equals: totalSum,
      };
    }

    if (date || gteDate || lteDate) {
      filter.date = {
        gte: gteDate,
        lte: lteDate,
        equals: date,
      };
    }

    try {
      const data = await this.prisma.order.findMany({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: orderBy,
        },
        include: { orderProducts: { include: { level: true, profession: true, tool: true } }, owner: { omit: { password: true, refreshToken: true } }, masters: true } as any,
      });

      const total = await this.prisma.order.count({ where: filter });

      const totalPages = Math.ceil(total / limit);

      return { 
        total,
        currentPage: page,
        totalPages,
        data
       };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string, userId?: string, userRole?: string) {
    try {
      const where: any = { id };
      if ((userRole === UserRole.USER_FIZ || userRole === UserRole.USER_FIZ) && userId) {
        where.ownerId = userId; 
      }

      const order = await this.prisma.order.findUnique({
        where,
        include: { owner: { omit: { password: true, refreshToken: true } }, orderProducts: true, masters: true } as any,
      });

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      return order;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateOrderDto, userId: string, userRole: string) {
    try {
      const existing = await this.prisma.order.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Order not found.');
      }

      const { masterIds, status, ...body } = dto;

      // Update orderProducts if provided
      // if (orderProducts?.length) {
      //   // Delete old orderProducts
      //   // await this.prisma.orderProduct.deleteMany({ where: { orderId: id } });

      //   const orderProductsIds = orderProducts.map(op => op.id);

      //   // Validate and create new orderProducts
      //   const professionIds = orderProducts
      //     .filter(op => op.professionId)
      //     .map(op => op.professionId);
      //   const toolIds = orderProducts.filter(op => op.toolId).map(op => op.toolId);

      //   const validProfessions = await this.prisma.profession.findMany({
      //     where: { id: { in: professionIds } },
      //   });
      //   if (validProfessions.length !== professionIds.length) {
      //     throw new BadRequestException('One or more profession IDs are invalid.');
      //   }

      //   const validTools = await this.prisma.tool.findMany({
      //     where: { id: { in: toolIds } },
      //   });
      //   if (validTools.length !== toolIds.length) {
      //     throw new BadRequestException('One or more tool IDs are invalid.');
      //   }

      //   const orderProductData = orderProducts.map(product => ({
      //     orderId: id,
      //     professionId: product.professionId,
      //     toolId: product.toolId,
      //     levelId: product.levelId,
      //     quantity: product.quantity,
      //     timeUnit: product.timeUnit,
      //     workingTime: product.workingTime,
      //     price:
      //       product.timeUnit === 'HOURLY'
      //         ? product.workingTime *
      //           (product.professionId
      //             ? validProfessions.find(p => p.id === product.professionId)?.priceHourly
      //             : validTools.find(t => t.id === product.toolId)?.price)
      //         : product.workingTime *
      //           (product.professionId
      //             ? validProfessions.find(p => p.id === product.professionId)?.priceDaily
      //             : validTools.find(t => t.id === product.toolId)?.price),
      //   }));
      //   await this.prisma.orderProduct.createMany({ data: orderProductData });
      // }

      // Assign masters if provided (only ADMIN/SUPER_ADMIN)
      if (masterIds?.length) {
        const validMasters = await this.prisma.master.findMany({
          where: { id: { in: masterIds } },
        });
        if (validMasters.length !== masterIds.length) {
          throw new BadRequestException('One or more master IDs are invalid.');
        }

        await this.prisma.orderMaster.deleteMany({ where: { orderId: id } });
        const orderMasterData = masterIds.map(masterId => ({
          orderId: id,
          masterid: masterId,
        }));
        await this.prisma.orderMaster.createMany({ data: orderMasterData });
      }

      // Update the order
      const updated = await this.prisma.order.update({
        where: { id },
        data: { status, ...body },
      });


      if ( status && (status === 'COMPLETED' || status === 'CANCELLED' ||  status === 'REJECTED') ) {
        const orderProducts = await this.prisma.orderProduct.findMany({
          where: { orderId: id },
        });

        if (orderProducts.length) {
          for (let i = 0; i < orderProducts.length; i++) {

            if ( orderProducts[i].toolId ) {
              const tool = await this.prisma.tool.findUnique({
                where: { id: orderProducts[i].toolId ?? undefined },
              });
              if (tool) {
                await this.prisma.tool.update({
                  where: { id: tool.id },
                  // data: { quantity: { decrement: orderProducts[i].quantity } }
                  data: { quantity: tool.quantity + orderProducts[i].quantity },
                });
              }
            }
          }
        }

        // if (orderProducts.length) {
        //   const toolsToUpdate = orderProducts
        //     .filter(op => op.toolId)
        //     .map(op => op.toolId);

        //     if (toolsToUpdate.length) {
        //       for (  let i = 0; i < toolsToUpdate.length; i++) {
        //         const tool = await this.prisma.tool.findUnique({
        //           where: { id: toolsToUpdate[i] ?? undefined },
        //         });
        //         if (tool) {
        //           await this.prisma.tool.update({
        //             where: { id: tool.id },
        //             data: { quantity: tool.quantity + orderProducts[i].quantity },
        //           });
        //         }
        //       }
        //     }
        // }
      }

      return { message: 'Order updated successfully', data: updated };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string, isAdmin = false) {
    try {
      const existing = await this.prisma.order.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Order not found.');
      }

      await this.prisma.order.delete({ where: { id } });
      return { message: 'Order deleted successfully' };
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
    throw new InternalServerErrorException('Internal server error');
  }
}