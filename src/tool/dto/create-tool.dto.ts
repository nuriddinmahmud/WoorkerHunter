import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsBoolean, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateToolDto {
  @ApiProperty({ description: 'Name in Uzbek', example: 'Drill' })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  nameUz: string;

  @ApiProperty({ description: 'Name in Russian', example: 'Дрель', required: false })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  @Matches(/^[А-Яа-яЁё0-9\s.,'"“”‘’!?()\-–—]+$/, {
    message: 'nameRu can only contain Cyrillic letters, spaces, apostrophes, and dashes',
  })
  nameRu?: string;

  @ApiProperty({ description: 'Name in English', example: 'Drill', required: false })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  nameEn?: string;

  @ApiProperty({ description: 'Description in Uzbek', example: 'Elektron burg\'ulash asbobi' })
  @IsNotEmpty({ message: 'descriptionUz is required' })
  @IsString({ message: 'descriptionUz must be a string' })
  descriptionUz: string;

  @ApiProperty({ description: 'Description in Russian', example: 'Электронная дрель', required: false })
  @IsOptional()
  @IsString({ message: 'descriptionRu must be a string' })
  descriptionRu?: string;

  @ApiProperty({ description: 'Description in English', example: 'Electronic drilling tool', required: false })
  @IsOptional()
  @IsString({ message: 'descriptionEn must be a string' })
  descriptionEn?: string;

  @ApiProperty({ description: 'Price of the tool', example: 150.75 })
  @IsNotEmpty({ message: 'price is required' })
  @IsNumber({}, { message: 'price must be a number' })
  price: number;

  @ApiProperty({ description: 'Quantity available', example: 10 })
  @IsNotEmpty({ message: 'quantity is required' })
  @IsInt({ message: 'quantity must be an integer' })
  quantity: number;

  @ApiProperty({ description: 'Brand ID', required: false })
  @IsOptional()
  @IsString({ message: 'brandId must be a string' })
  brandId?: string;

  @ApiProperty({ description: 'Power ID', required: false })
  @IsOptional()
  @IsString({ message: 'capacityId must be a string' })
  capacityId?: string;

  @ApiProperty({ description: 'Size ID', required: false })
  @IsOptional()
  @IsString({ message: 'sizeId must be a string' })
  sizeId?: string;

  @ApiProperty({ description: 'Image filename', example: 'drill.jpg' })
  @IsNotEmpty({ message: 'img is required' })
  @IsString({ message: 'img must be a string' })
  img: string;

  @ApiProperty({ description: 'Availability status', example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'isAvailable must be a boolean' })
  isAvailable?: boolean;
}
