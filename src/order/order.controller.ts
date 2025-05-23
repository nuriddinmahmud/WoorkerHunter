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
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { UserRole } from '../admin/dto/create-admin.dto';
import { PaymentType, QueryOrderDto, SortOrder, StatusOrder } from './dto/search-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create an order (USER only)' })
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.id;
    return this.orderService.create(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all orders with filters' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for address or delivery comment' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', enum: SortOrder })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc or desc)', enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status', enum: StatusOrder })

  @ApiQuery({ name: 'paymentType', required: false, enum: PaymentType, description: 'Filter by payment type' })
  @ApiQuery({ name: 'isPaid', required: false, enum: ['true', 'false'], description: 'Filter by paid status' })
  @ApiQuery({ name: 'withDelivery', required: false, enum: ['true', 'false'], description: 'Filter by delivery status' })
  @ApiQuery({ name: 'totalSum', required: false, type: String, description: 'Filter by total sum' })
  @ApiQuery({ name: 'Less than or equal to total sum', required: false, type: String , description: 'Filter by total sum (lte)' })
  @ApiQuery({ name: 'Greater than or equal to total sum', required: false, type: String, description: 'Filter by total sum (gte)' })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Filter by date' })
  @ApiQuery({ name: 'Less than or equal to date', required: false, type: String, description: 'Filter by date (lte)' })
  @ApiQuery({ name: 'Greater than or equal to date', required: false, type: String , description: 'Filter by date (gte)' })
  findAll(
    @Query() query: QueryOrderDto,
    @Req() req: any
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.orderService.findAll(query, userId, userRole);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single order by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.orderService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update order (ADMIN or SUPER_ADMIN only)' })
  update(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.orderService.update(id, dto, userId, userRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete order (ADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}