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
  Req,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
// import { UserRole } from '@prisma/client';
import { UserRole } from '../admin/dto/create-admin.dto';

@ApiTags('Tool')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, example: 'drill', description: 'Search by name or code of the tool' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'price', description: 'Sort by price or name' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc', description: 'Sort order' })
  findAll(@Query() query) {
    return this.toolService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(id, updateToolDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.toolService.remove(id);
  }
}
