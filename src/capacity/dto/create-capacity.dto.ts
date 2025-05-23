import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCapacityDto {
  @ApiProperty({
    description: 'Name of the capacity in Uzbek',
    example: '500W',
    required: true,
  })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  nameUz: string;

  @ApiPropertyOptional({
    description: 'Name of the capacity in Russian',
    example: '500Вт',
  })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  @Matches(/^[А-Яа-яЁё0-9\s\W]+$/, {
    message: 'nameRu must contain only valid Russian characters',
  })
  nameRu?: string;

  @ApiPropertyOptional({
    description: 'Name of the capacity in English',
    example: '500W',
  })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  nameEn?: string;
}