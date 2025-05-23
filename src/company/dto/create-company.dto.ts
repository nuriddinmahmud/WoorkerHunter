import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Kompaniya nomi', description: 'Name of the company in Uzbek' })
  @IsNotEmpty({ message: 'nameUz is required' })
  @IsString({ message: 'nameUz must be a string' })
  nameUz: string;

  @ApiProperty({ example: 'Компания', description: 'Name of the company in Russian', required: false })
  @IsOptional()
  @IsString({ message: 'nameRu must be a string' })
  @Matches(/^[А-Яа-яЁё\s0-9.,'"\-!?():;]+$/, {
    message: 'nameRu can only contain Cyrillic letters and common characters',
  })
  nameRu?: string;

  @ApiProperty({ example: 'Company Name', description: 'Name of the company in English', required: false })
  @IsOptional()
  @IsString({ message: 'nameEn must be a string' })
  nameEn?: string;

  @ApiProperty({ example: '123456789', description: 'Tax ID', required: false })
  @IsOptional()
  @IsString({ message: 'taxId must be a string' })
  taxId?: string;

  @ApiProperty({ example: '01001', description: 'Bank Code', required: false })
  @IsOptional()
  @IsString({ message: 'bankCode must be a string' })
  bankCode?: string;

  @ApiProperty({ example: '1234567890123456', description: 'Bank Account', required: false })
  @IsOptional()
  @IsString({ message: 'bankAccount must be a string' })
  bankAccount?: string;

  @ApiProperty({ example: 'ZNZ', description: 'Bank Name', required: false })
  @IsOptional()
  @IsString({ message: 'bankName must be a string' })
  bankName?: string;

  @ApiProperty({ example: '12345', description: 'OKED', required: false })
  @IsOptional()
  @IsString({ message: 'oked must be a string' })
  oked?: string;

  @ApiProperty({ example: 'Yunusobod, Tashkent', description: 'Company Address', required: false })
  @IsOptional()
  @IsString({ message: 'address must be a string' })
  address?: string;

  @ApiProperty({ example: 'uuid-of-user', description: 'User ID who owns the company' })
  @IsNotEmpty({ message: 'ownerId is required' })
  @IsString({ message: 'ownerId must be a string' })
  ownerId: string;
}
