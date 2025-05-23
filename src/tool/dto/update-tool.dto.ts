import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @ApiPropertyOptional({ description: 'Updated name in Uzbek', example: 'Perforator' })
  nameUz?: string;

  @ApiPropertyOptional({ description: 'Updated name in Russian', example: 'Перфоратор' })
  nameRu?: string;

  @ApiPropertyOptional({ description: 'Updated name in English', example: 'Perforator' })
  nameEn?: string;

  @ApiPropertyOptional({ description: 'Updated description in Uzbek', example: 'Yangi elektron burg\'ulash asbobi' })
  descriptionUz?: string;

  @ApiPropertyOptional({ description: 'Updated description in Russian', example: 'Новая электронная дрель' })
  descriptionRu?: string;

  @ApiPropertyOptional({ description: 'Updated description in English', example: 'New electronic drilling tool' })
  descriptionEn?: string;

  @ApiPropertyOptional({ description: 'Updated price', example: 175.50 })
  price?: number;

  @ApiPropertyOptional({ description: 'Updated quantity', example: 15 })
  quantity?: number;

  @ApiPropertyOptional({ description: 'Updated brand ID' })
  brandId?: string;

  @ApiPropertyOptional({ description: 'Updated capacity ID' })
  capacityId?: string;

  @ApiPropertyOptional({ description: 'Updated size ID' })
  sizeId?: string;

  @ApiPropertyOptional({ description: 'Updated image filename', example: 'new-drill.jpg' })
  img?: string;

  @ApiPropertyOptional({ description: 'Updated availability status', example: false })
  isAvailable?: boolean;
}
