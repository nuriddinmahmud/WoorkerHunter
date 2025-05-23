import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelDto } from './create-level.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLevelDto extends PartialType(CreateLevelDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the level in Uzbek',
    example: 'Oʻrta',
  })
  nameUz?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the level in Russian',
    example: 'Средний',
  })
  nameRu?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the level in English',
    example: 'Intermediate',
  })
  nameEn?: string;
}
