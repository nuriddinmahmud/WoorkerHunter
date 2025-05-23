import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { UserRole } from '@prisma/client';
import { UserRole } from './dto/create-admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  addAdmin(@Body() addAdminDto: AddAdminDto) {
    return this.adminService.addAdmin(addAdminDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER_ADMIN)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'Ali' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query() query?: Record<string, any>,
  ) {
    const { page: _p, limit: _l, search: _s, sortBy: _sb, sortOrder: _so, ...filter } = query || {};

    return this.adminService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      sortBy,
      sortOrder,
      filter,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }
}
