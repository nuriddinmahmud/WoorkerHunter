import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { UserRole } from '../admin/dto/create-admin.dto';

@ApiTags('Professions')
@ApiBearerAuth()
@Controller('professions')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a profession (ADMIN only)' })
  create(@Body() dto: CreateProfessionDto) {
    return this.professionService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  @ApiOperation({ summary: 'Get all professions with filters' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required:false, example: "Elektrik", description:"Search term for name fields" })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc', description: 'Sort order (asc or desc)' })
  @ApiQuery({ name: 'isActive', required: false, example: true, description: 'Filter by isActive' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('isActive') isActive?: boolean,
  ) {
    return this.professionService.findAll({
      page: page ?? 1,
      limit: limit ?? 10,
      search,
      sortBy,
      sortOrder: sortOrder ?? 'asc',
      isActive,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  @ApiOperation({ summary: 'Get a single profession by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.professionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update profession (ADMIN or SUPER_ADMIN only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfessionDto,
  ) {
    return this.professionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete profession and its image (ADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.professionService.remove(id);
  }
}






// import {
//   Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards
// } from '@nestjs/common';
// import { ProfessionService } from './profession.service';
// import { CreateProfessionDto } from './dto/create-profession.dto';
// import { UpdateProfessionDto } from './dto/update-profession.dto';
// import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../guard/jwt-auth.guard';
// import { RolesGuard } from '../guard/roles.guard';
// import { Roles } from '../guard/roles.decorator';
// import { UserRole } from '@prisma/client';

// @ApiTags('Profession')
// @Controller('profession')
// export class ProfessionController {
//   constructor(private readonly service: ProfessionService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.ADMIN)
//   @ApiBearerAuth()
//   create(@Body() dto: CreateProfessionDto) {
//     return this.service.create(dto);
//   }

//   @Get()
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 10 })
//   @ApiQuery({ name: 'search', required: false, example: 'Elektrik' })
//   @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
//   @ApiQuery({ name: 'sortOrder', required: false, example: 'desc' })
//   findAll(
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//     @Query('search') search?: string,
//     @Query('sortBy') sortBy?: string,
//     @Query('sortOrder') sortOrder?: 'asc' | 'desc',
//     @Query() query?: Record<string, any>,
//   ) {
//     const { page: _p, limit: _l, search: _s, sortBy: _sb, sortOrder: _so, ...filter } = query || {};

//     return this.service.findAll({
//       page: page ? parseInt(page, 10) : undefined,
//       limit: limit ? parseInt(limit, 10) : undefined,
//       search,
//       sortBy,
//       sortOrder,
//       filter,
//     });
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.service.findOne(id);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
//   @ApiBearerAuth()
//   update(@Param('id') id: string, @Body() dto: UpdateProfessionDto) {
//     return this.service.update(id, dto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.ADMIN)
//   @ApiBearerAuth()
//   remove(@Param('id') id: string) {
//     return this.service.remove(id);
//   }
// }
