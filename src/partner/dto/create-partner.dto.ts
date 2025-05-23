import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Name in Uzbek', example: 'Hamkorlik' })
  @IsNotEmpty()
  @IsString()
  nameUz: string;

  @ApiProperty({ description: 'Name in Russian', example: 'Партнёр', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[А-Яа-яЁё0-9\s.,'"“”‘’!?()\-–—]+$/, {
    message: 'nameRu can only contain Cyrillic letters, numbers and common punctuation',
  })
  nameRu?: string;

  @ApiProperty({ description: 'Name in English', example: 'Partner', required: false })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiProperty({ description: 'Image filename', example: 'partner-img.jpg' })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ description: 'Web-Site link of a partner', example:'https://erp.student.najottalim.uz' })
  @IsOptional()
  @IsString()
  link?: string
}
