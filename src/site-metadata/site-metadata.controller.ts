import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SiteMetadataService } from './site-metadata.service';
import { CreateSiteMetadatumDto } from './dto/create-site-metadatum.dto';
import { UpdateSiteMetadatumDto } from './dto/update-site-metadatum.dto';

@Controller('site-metadata')
export class SiteMetadataController {
  constructor(private readonly siteMetadataService: SiteMetadataService) {}

  @Post()
  create(@Body() createSiteMetadatumDto: CreateSiteMetadatumDto) {
    return this.siteMetadataService.create(createSiteMetadatumDto);
  }

  @Get()
  findAll() {
    return this.siteMetadataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteMetadataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteMetadatumDto: UpdateSiteMetadatumDto) {
    return this.siteMetadataService.update(+id, updateSiteMetadatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteMetadataService.remove(+id);
  }
}
