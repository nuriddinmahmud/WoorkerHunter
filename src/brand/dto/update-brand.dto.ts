import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the tool brand in Uzbek',
    example: 'Aser',
  })
  nameUz?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the tool brand in Russian',
    example: 'Асер',
  })
  nameRu?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the tool brand in English',
    example: 'Acer',
  })
  nameEn?: string;
}
