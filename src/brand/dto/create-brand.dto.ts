import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Name of the tool brand in Uzbek',
    example: 'Makita',
    required: false,
  })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  nameUz: string;

  @ApiProperty({
    description: 'Name of the tool brand in Russian',
    example: 'Макита',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  nameRu?: string;

  @ApiProperty({
    description: 'Name of the tool brand in English',
    example: 'Makita',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  nameEn?: string;
}
