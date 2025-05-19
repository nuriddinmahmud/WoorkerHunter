import { PartialType } from '@nestjs/swagger';
import { CreateSiteMetadatumDto } from './create-site-metadatum.dto';

export class UpdateSiteMetadatumDto extends PartialType(CreateSiteMetadatumDto) {}
