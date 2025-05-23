import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({
    description: 'Name of the region in Uzbek',
    example: 'Toshkent',
    required: false,
  })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  @Matches(/^[A-Za-zÀ-ÿ\s'-]+$/, {
    message: 'nameUz can only contain letters, spaces, apostrophes, and dashes',
  })
  nameUz: string;

  @ApiProperty({
    description: 'Name of the region in Russian',
    example: 'Ташкент',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  @Matches(/^[А-Яа-яЁё\s'-]+$/, {
    message: 'nameRu can only contain Cyrillic letters, spaces, apostrophes, and dashes',
  })
  nameRu?: string;

  @ApiProperty({
    description: 'Name of the region in English',
    example: 'Tashkent',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  @Matches(/^[A-Za-z\s'-]+$/, {
    message: 'nameEn can only contain English letters, spaces, apostrophes, and dashes',
  })
  nameEn?: string;
}
