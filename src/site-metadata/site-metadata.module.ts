import { Module } from '@nestjs/common';
import { SiteMetadataService } from './site-metadata.service';
import { SiteMetadataController } from './site-metadata.controller';

@Module({
  controllers: [SiteMetadataController],
  providers: [SiteMetadataService],
})
export class SiteMetadataModule {}
