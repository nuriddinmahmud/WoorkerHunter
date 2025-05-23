import { PartialType } from '@nestjs/mapped-types';
import { CreateCapacityDto } from './create-capacity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCapacityDto extends PartialType(CreateCapacityDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the capacity in Uzbek',
    example: '1000W',
  })
  nameUz?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the capacity in Russian',
    example: '1000Вт',
  })
  nameRu?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the capacity in English',
    example: '1000W',
  })
  nameEn?: string;
}