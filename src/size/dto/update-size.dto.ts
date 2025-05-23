// size/dto/update-size.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeDto } from './create-size.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the size in Uzbek',
    example: 'O\'rta',
  })
  nameUz?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the size in Russian',
    example: 'Средний',
  })
  @Matches(/^[А-Яа-яЁё\s'-]+$/, {
    message: 'nameRu must contain only Russian letters, spaces, apostrophes, and dashes',
  })
  nameRu?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the size in English',
    example: 'Medium',
  })
  nameEn?: string;
}
