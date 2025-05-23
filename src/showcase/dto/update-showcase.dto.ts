import { PartialType } from '@nestjs/mapped-types';
import { CreateShowcaseDto } from './create-showcase.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateShowcaseDto extends PartialType(CreateShowcaseDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the showcase in Uzbek',
    example: 'Namuna ko‘rgazmasi',
  })
  nameUz?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the showcase in Russian',
    example: 'Выставка образцов',
  })
  nameRu?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the showcase in English',
    example: 'Sample Showcase',
  })
  nameEn?: string;

  @ApiPropertyOptional({
    description: 'Updated description in Uzbek',
    example: 'Bu ko‘rgazma namunasi',
  })
  descriptionUz?: string;

  @ApiPropertyOptional({
    description: 'Updated description in Russian',
    example: 'Это образец выставки',
  })
  descriptionRu?: string;

  @ApiPropertyOptional({
    description: 'Updated description in English',
    example: 'This is a sample showcase',
  })
  descriptionEn?: string;

  @ApiPropertyOptional({
    description: 'Updated image filename',
    example: 'showcase123.jpg',
  })
  image?: string;

  @ApiPropertyOptional({
    description: 'Updated link for the showcase',
    example: 'https://example.com/showcase',
  })
  link?: string;
}
