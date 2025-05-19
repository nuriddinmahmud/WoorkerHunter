import { Injectable } from '@nestjs/common';
import { CreateSiteMetadatumDto } from './dto/create-site-metadatum.dto';
import { UpdateSiteMetadatumDto } from './dto/update-site-metadatum.dto';

@Injectable()
export class SiteMetadataService {
  create(createSiteMetadatumDto: CreateSiteMetadatumDto) {
    return 'This action adds a new siteMetadatum';
  }

  findAll() {
    return `This action returns all siteMetadata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} siteMetadatum`;
  }

  update(id: number, updateSiteMetadatumDto: UpdateSiteMetadatumDto) {
    return `This action updates a #${id} siteMetadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} siteMetadatum`;
  }
}
