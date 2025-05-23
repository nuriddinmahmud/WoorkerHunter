import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { UserRole } from '../admin/dto/create-admin.dto'; 
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';

@ApiTags('Basket')
@ApiBearerAuth()
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER_FIZ, UserRole.USER_YUR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a basket item (USERs only)' })
  create(@Body() dto: CreateBasketDto, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.basketService.create(dto, userId, userRole);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all basket items (ADMIN or USER)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (price, createdAt, updatedAt)', enum: ['price', 'createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc or desc)', enum: ['asc', 'desc'] })
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'price' | 'createdAt' | 'updatedAt',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.basketService.findAll(userId, userRole, page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single basket item by ID' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.basketService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER_FIZ, UserRole.USER_YUR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a basket item (OWNER or ADMINs)' })
  update(@Param('id') id: string, @Body() dto: UpdateBasketDto, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.basketService.update(id, dto, userId, userRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER_FIZ, UserRole.USER_YUR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a basket item (OWNER or ADMIN)' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.basketService.remove(id, userId, userRole);
  }
}