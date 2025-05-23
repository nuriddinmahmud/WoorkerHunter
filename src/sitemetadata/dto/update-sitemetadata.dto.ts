import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteMetadataDto } from './create-sitemetadata.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSiteMetadataDto extends PartialType(CreateSiteMetadataDto) {
  @ApiPropertyOptional({
    description: 'Updated about section in Uzbek',
    example: 'Yangi matn',
  })
  aboutUz?: string;

  @ApiPropertyOptional({
    description: 'Updated about section in Russian',
    example: 'Новый текст',
  })
  aboutRu?: string;

  @ApiPropertyOptional({
    description: 'Updated about section in English',
    example: 'New text',
  })
  aboutEn?: string;

  @ApiPropertyOptional({
    description: 'Updated privacy policy in Uzbek',
    example: 'Yangi maxfiylik siyosati',
  })
  privacyPolicyUz?: string;

  @ApiPropertyOptional({
    description: 'Updated privacy policy in Russian',
    example: 'Новая политика конфиденциальности',
  })
  privacyPolicyRu?: string;

  @ApiPropertyOptional({
    description: 'Updated privacy policy in English',
    example: 'Updated privacy policy',
  })
  privacyPolicyEn?: string;

  @ApiPropertyOptional({
    description: 'Updated contact email',
    example: 'new@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Updated phone number in +998XXXXXXXXX format',
    example: '+998998765432',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Updated social media links',
    example: {
      instagram: 'https://instagram.com/new',
      telegram: 'https://t.me/new',
    },
  })
  socialMedia?: Record<string, string>;
}
