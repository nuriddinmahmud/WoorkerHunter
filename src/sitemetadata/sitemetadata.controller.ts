import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SiteMetadataService } from './sitemetadata.service';
import { CreateSiteMetadataDto } from './dto/create-sitemetadata.dto';
import { UpdateSiteMetadataDto } from './dto/update-sitemetadata.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../guard/roles.decorator';
// import { UserRole } from '@prisma/client';
import { UserRole } from '../admin/dto/create-admin.dto';

@ApiTags('SiteMetadata')
@Controller('site-metadata')
export class SiteMetadataController {
  constructor(private readonly siteMetadataService: SiteMetadataService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  create(@Body() createSiteMetadataDto: CreateSiteMetadataDto) {
    return this.siteMetadataService.create(createSiteMetadataDto);
  }

  @Get()
  findAll() {
    return this.siteMetadataService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateSiteMetadataDto: UpdateSiteMetadataDto,
  ) {
    return this.siteMetadataService.update(id, updateSiteMetadataDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.siteMetadataService.remove(id);
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
// } from '@nestjs/common';
// import { SiteMetadataService } from './sitemetadata.service';
// import { CreateSiteMetadataDto } from './dto/create-sitemetadata.dto';
// import { UpdateSiteMetadataDto } from './dto/update-sitemetadata.dto';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('SiteMetadata')
// @Controller('site-metadata')
// export class SiteMetadataController {
//   constructor(private readonly siteMetadataService: SiteMetadataService) {}

//   @Post()
//   create(@Body() createSiteMetadataDto: CreateSiteMetadataDto) {
//     return this.siteMetadataService.create(createSiteMetadataDto);
//   }

//   @Get()
//   findAll() {
//     return this.siteMetadataService.findAll();
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateSiteMetadataDto: UpdateSiteMetadataDto,
//   ) {
//     return this.siteMetadataService.update(id, updateSiteMetadataDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.siteMetadataService.remove(id);
//   }
// }
