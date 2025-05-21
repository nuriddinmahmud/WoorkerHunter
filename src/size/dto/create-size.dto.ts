import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeDto {
  @ApiProperty({
    description: 'Name of the size in Uzbek',
    example: 'Kichik',
  })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  nameUz: string;

  @ApiProperty({
    description: 'Name of the size in Russian',
    example: 'Маленький',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  @Matches(/^[А-Яа-яЁё\s'-]+$/, {
    message: 'nameRu must contain only Russian letters, spaces, apostrophes, and dashes',
  })
  nameRu?: string;

  @ApiProperty({
    description: 'Name of the size in English',
    example: 'Small',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  nameEn?: string;
}
