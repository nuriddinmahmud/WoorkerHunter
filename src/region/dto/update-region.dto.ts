import { PartialType } from '@nestjs/mapped-types';
import { CreateRegionDto } from './create-region.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the region in Uzbek',
    example: 'Samarqand',
  })
  nameUz?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the region in Russian',
    example: 'Самарканд',
  })
  nameRu?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the region in English',
    example: 'Samarkand',
  })
  nameEn?: string;
}
