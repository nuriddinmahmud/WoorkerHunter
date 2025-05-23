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
} from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { UserRole } from '../admin/dto/create-admin.dto';
import { QueryMasterDto, SearchMasterDto, SearchSort, Sort } from './dto/search-master.dto';

@ApiTags('Masters')
@ApiBearerAuth()
@Controller('masters')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a master (ADMIN only)' })
  create(@Body() dto: CreateMasterDto) {
    return this.masterService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VIEWER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'phoneNumber', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'sortBy', required: false, enum: Sort })
  @ApiQuery({ name: 'isActive', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'minYear', required: false, type: Number })
  @ApiQuery({ name: 'maxYear', required: false, type: Number })
  @ApiQuery({ name: 'birthYear', required: false, type: Number })

  findAll(@Query() query: QueryMasterDto) {
    return this.masterService.findAll(query);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VIEWER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiQuery({ name: 'professionId', required: false, type: String })
  @ApiQuery({ name: 'levelId', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'sortBy', required: false, enum: SearchSort })
  @ApiQuery({ name: 'LessThan or Equal Experience', required: false, type: Number })
  @ApiQuery({ name: 'GreaterThan or Equal Experience', required: false, type: Number })
  @ApiQuery({ name: 'experience', required: false, type: Number })
  @ApiQuery({ name: 'LessThan PriceDaily', required: false, type: Number })
  @ApiQuery({ name: 'GreaterThan PriceDaily', required: false, type: Number })
  @ApiQuery({ name: 'priceDaily', required: false, type: Number })
  @ApiQuery({ name: 'LessThan PriceHourly', required: false, type: Number })
  @ApiQuery({ name: 'GreaterThan PriceHourly', required: false, type: Number })
  @ApiQuery({ name: 'priceHourly', required: false, type: Number })
  @ApiQuery({ name: 'Less Than MinWorkingHours', required: false, type: Number })
  @ApiQuery({ name: 'Greater Than MinWorkingHours', required: false, type: Number })
  @ApiQuery({ name: 'minWorkingHours', required: false, type: Number })

  search(@Query() query: SearchMasterDto) {
    return this.masterService.search(query);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  // @ApiOperation({ summary: 'Get all masters with filters' })
  // @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  // @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
  // @ApiQuery({ name: 'search', required: false, example: 'John', description: 'Search term for name or phone' })
  // @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt', description: 'Field to sort by' })
  // @ApiQuery({ name: 'sortOrder', required: false, example: 'asc', description: 'Sort order (asc or desc)' })
  // @ApiQuery({ name: 'isActive', required: false, example: true, description: 'Filter by isActive' })
  // findAll(
  //   @Query('page') page?: number,
  //   @Query('limit') limit?: number,
  //   @Query('search') search?: string,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  //   @Query('isActive') isActive?: boolean,
  // ) {
  //   return this.masterService.findAll({
  //     page: page ?? 1,
  //     limit: limit ?? 10,
  //     search,
  //     sortBy,
  //     sortOrder: sortOrder ?? 'asc',
  //     isActive,
  //   });
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  @ApiOperation({ summary: 'Get a single master by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update master (ADMIN or SUPER_ADMIN only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMasterDto,
  ) {
    return this.masterService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete master and its images (ADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterService.remove(id);
  }
}