import { IsNotEmpty, IsOptional, IsString, Matches, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShowcaseDto {
  @ApiProperty({ description: 'Name in Uzbek', example: 'Ko‘rgazma' })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  nameUz: string;

  @ApiProperty({ description: 'Name in Russian', example: 'Выставка', required: false })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  @Matches(/^[А-Яа-яЁё0-9\s.,'"“”‘’!?()\-–—:;@#$%^&*_+=/\\[\]{}|`~<>№«»]+$/, {
    message: 'nameRu can only contain valid Russian characters and punctuation',
  })
  nameRu?: string;

  @ApiProperty({ description: 'Name in English', example: 'Exhibition', required: false })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  nameEn?: string;

  @ApiProperty({ description: 'Description in Uzbek', example: 'Bu ko‘rgazma haqida batafsil.' })
  @IsNotEmpty({ message: 'descriptionUz is required' })
  @IsString({ message: 'descriptionUz must be a string' })
  descriptionUz: string;

  @ApiProperty({ description: 'Description in Russian', example: 'Это описание выставки.', required: false })
  @IsOptional()
  @IsString({ message: 'descriptionRu must be a string' })
  @Matches(/^[А-Яа-яЁё0-9\s.,'"“”‘’!?()\-–—:;@#$%^&*_+=/\\[\]{}|`~<>№«»]+$/, {
    message: 'descriptionRu can only contain valid Russian characters and punctuation',
  })
  descriptionRu?: string;

  @ApiProperty({ description: 'Description in English', example: 'Detailed description of the showcase.', required: false })
  @IsOptional()
  @IsString({ message: 'descriptionEn must be a string' })
  descriptionEn?: string;

  @ApiProperty({ description: 'Image filename', example: 'example.jpg' })
  @IsNotEmpty({ message: 'Image is required' })
  @IsString({ message: 'Image must be a string' })
  image: string;

  @ApiProperty({ description: 'Showcase link', example: 'https://example.com' })
  @IsNotEmpty({ message: 'Link is required' })
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link: string;
}
