import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiPropertyOptional({ example: 'Kompaniya yangilangan nomi', description: 'Updated name in Uzbek' })
  nameUz?: string;

  @ApiPropertyOptional({ example: 'Компания', description: 'Updated name in Russian' })
  nameRu?: string;

  @ApiPropertyOptional({ example: 'Company Name', description: 'Updated name in English' })
  nameEn?: string;

  @ApiPropertyOptional({ example: '123456789', description: 'Updated tax ID' })
  taxId?: string;

  @ApiPropertyOptional({ example: '01001', description: 'Updated bank code' })
  bankCode?: string;

  @ApiPropertyOptional({ example: '1234567890123456', description: 'Updated bank account' })
  bankAccount?: string;

  @ApiPropertyOptional({ example: 'ZNZ', description: 'Updated bank name' })
  bankName?: string;

  @ApiPropertyOptional({ example: '12345', description: 'Updated OKED' })
  oked?: string;

  @ApiPropertyOptional({ example: 'Chilonzor, Tashkent', description: 'Updated address' })
  address?: string;
}
