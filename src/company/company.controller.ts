// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { CompanyService } from './company.service';
// import { CreateCompanyDto } from './dto/create-company.dto';
// import { UpdateCompanyDto } from './dto/update-company.dto';
// import { JwtAuthGuard } from '../guard/jwt-auth.guard';
// import { RolesGuard } from '../guard/roles.guard';
// import { Roles } from '../guard/roles.decorator';
// import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { UserRole } from '../admin/dto/create-admin.dto';

// @ApiTags('Company')
// @Controller('company')
// export class CompanyController {
//   constructor(private readonly companyService: CompanyService) {}

//   @Post()
//   create(@Body() createCompanyDto: CreateCompanyDto) {
//     return this.companyService.create(createCompanyDto);
//   }

//   @Get()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
//   @ApiBearerAuth()
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 10 })
//   @ApiQuery({ name: 'search', required: false, example: 'MCHJ' })
//   @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
//   @ApiQuery({ name: 'sortOrder', required: false, example: 'desc' })
//   findAll(
//     @Req() req,
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//     @Query('search') search?: string,
//     @Query('sortBy') sortBy?: string,
//     @Query('sortOrder') sortOrder?: 'asc' | 'desc',
//     @Query() query?: Record<string, any>,
//   ) {
//     const userId = req.user.id;
//     const { page: _p, limit: _l, search: _s, sortBy: _sb, sortOrder: _so, ...filter } = query || {};

//     return this.companyService.findAll({
//       userId,
//       page: page ? parseInt(page, 10) : undefined,
//       limit: limit ? parseInt(limit, 10) : undefined,
//       search,
//       sortBy,
//       sortOrder,
//       filter,
//     });
//   }

//   @Get(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN, UserRole.USER_YUR)
//   @ApiBearerAuth()
//   findOne(@Param('id') id: string, @Req() req) {
//     const userId = req.user.id;
//     const userRole = req.user.role;
//     return this.companyService.findOne(id, userId, userRole);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER_YUR)
//   @ApiBearerAuth()
//   update(@Param('id') id: string, @Req() req, @Body() updateCompanyDto: UpdateCompanyDto) {
//     const userId = req.user.id;
//     const userRole = req.user.role;
//     return this.companyService.update(id, userId, userRole, updateCompanyDto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.ADMIN, UserRole.USER_YUR)
//   @ApiBearerAuth()
//   remove(@Param('id') id: string, @Req() req) {
//     const userId = req.user.id;
//     const userRole = req.user.role;
//     return this.companyService.remove(id, userId, userRole);
//   }
// }
