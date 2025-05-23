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
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { UserRole } from '@prisma/client';
import { UserRole } from '../admin/dto/create-admin.dto';

@ApiTags('Partner')
@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Limit number of items per page' })
  @ApiQuery({ name: 'search', required: false, example: 'Partner', description: 'Search term for name fields' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc', description: 'Sort order: asc or desc' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query() query?: Record<string, any>,
  ) {
    const { page: _p, limit: _l, search: _s, sortBy: _sb, sortOrder: _so, ...filter } = query || {};
    return this.partnerService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      sortBy,
      sortOrder,
      filter,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.partnerService.remove(id);
  }
}





// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
// } from '@nestjs/common';
// import { PartnerService } from './partner.service';
// import { CreatePartnerDto } from './dto/create-partner.dto';
// import { UpdatePartnerDto } from './dto/update-partner.dto';
// import { ApiQuery } from '@nestjs/swagger';

// @Controller('partner')
// export class PartnerController {
//   constructor(private readonly partnerService: PartnerService) {}

//   @Post()
//   create(@Body() createPartnerDto: CreatePartnerDto) {
//     return this.partnerService.create(createPartnerDto);
//   }

//   @Get()
//   @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
//   @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Limit number of items per page' })
//   @ApiQuery({ name: 'search', required: false, example: 'Partner', description: 'Search term for name fields' })
//   @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt', description: 'Field to sort by' })
//   @ApiQuery({ name: 'sortOrder', required: false, example: 'desc', description: 'Sort order: asc or desc' })
//   findAll(
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//     @Query('search') search?: string,
//     @Query('sortBy') sortBy?: string,
//     @Query('sortOrder') sortOrder?: 'asc' | 'desc',
//     @Query() query?: Record<string, any>,
//   ) {
//     const { page: _p, limit: _l, search: _s, sortBy: _sb, sortOrder: _so, ...filter } = query || {};
//     return this.partnerService.findAll({
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
//     return this.partnerService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
//     return this.partnerService.update(id, updatePartnerDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.partnerService.remove(id);
//   }
// }
