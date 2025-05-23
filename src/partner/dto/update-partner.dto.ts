import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerDto } from './create-partner.dto';
import { IsString } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @ApiPropertyOptional({ description: 'Updated nameUz', example: 'Yangi Hamkorlik' })
  @IsString()
  nameUz?: string;

  @ApiPropertyOptional({ description: 'Updated nameRu', example: 'Новый партнёр' })
  @IsString()
  nameRu?: string;

  @ApiPropertyOptional({ description: 'Updated nameEn', example: 'New Partner' })
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ description: 'Updated image filename', example: 'updated-partner.jpg' })
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Web-Site link of a partner', example:'https://erp.student.najottalim.uz' })
  @IsString()
  link?: string
}
