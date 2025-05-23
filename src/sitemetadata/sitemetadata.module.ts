import { Module } from '@nestjs/common';
import { SiteMetadataService } from './sitemetadata.service';
import { SiteMetadataController } from './sitemetadata.controller';

@Module({
  controllers: [SiteMetadataController],
  providers: [SiteMetadataService],
})
export class SitemetadataModule {}
