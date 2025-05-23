import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiPropertyOptional({ example: 'Ali' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Karimov' })
  lastName?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Tashkent' })
  address?: string;

  @ApiPropertyOptional({ example: 'Optional message' })
  message?: string;
}
