import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @ApiProperty({
    description: 'Name of the level in Uzbek',
    example: 'Boshlangʻich',
    required: false,
  })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  nameUz: string;

  @ApiProperty({
    description: 'Name of the level in Russian',
    example: 'Начальный',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  @Matches(/^[А-Яа-яЁё0-9\s.,'"“”‘’!?()\-–—]+$/, {
    message: 'nameRu can only contain Cyrillic letters, spaces, apostrophes, and dashes',
  })
  nameRu?: string;

  @ApiProperty({
    description: 'Name of the level in English',
    example: 'Beginner',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  nameEn?: string;
}
