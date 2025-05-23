import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    IsEmail,
    IsObject,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateSiteMetadataDto {
    @ApiProperty({
      description: 'About section in Uzbek',
      example: 'Biz haqimizda',
    })
    @IsNotEmpty()
    @IsString()
    aboutUz: string;
  
    @ApiProperty({
      description: 'About section in Russian',
      example: 'О нас',
      required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^[А-Яа-яЁё0-9\s.,'"“”‘’!?()\-–—]+$/, {
      message: 'aboutRu can only contain Russian characters, numbers and punctuation',
    })
    aboutRu?: string;
  
    @ApiProperty({
      description: 'About section in English',
      example: 'About us',
      required: false,
    })
    @IsOptional()
    @IsString()
    aboutEn?: string;
  
    @ApiProperty({
      description: 'Privacy policy in Uzbek',
      example: 'Maxfiylik siyosati',
    })
    @IsNotEmpty()
    @IsString()
    privacyPolicyUz: string;
  
    @ApiProperty({
      description: 'Privacy policy in Russian',
      example: 'Политика конфиденциальности',
      required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^[А-Яа-яЁё0-9\s.,'"“”‘’!?()\-–—]+$/, {
      message: 'privacyPolicyRu can only contain Russian characters, numbers and punctuation',
    })
    privacyPolicyRu?: string;
  
    @ApiProperty({
      description: 'Privacy policy in English',
      example: 'Privacy policy',
      required: false,
    })
    @IsOptional()
    @IsString()
    privacyPolicyEn?: string;
  
    @ApiProperty({
      description: 'Contact email',
      example: 'info@example.com',
    })
    @IsNotEmpty()
    @Matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      { message: 'Invalid email format' },
    )
    email: string;
  
    @ApiProperty({
      description: 'Phone number in +998XXXXXXXXX format',
      example: '+998901234567',
    })
    @IsNotEmpty()
    @Matches(/^\+998\d{9}$/, {
      message: 'Phone number must be in the format +998XXXXXXXXX',
    })
    phoneNumber: string;
  
    @ApiProperty({
      description: 'Social media links',
      example: {
        instagram: 'https://instagram.com/example',
        telegram: 'https://t.me/example',
      },
    })
    @IsNotEmpty()
    @IsObject()
    socialMedia: Record<string, string>;
  }
  