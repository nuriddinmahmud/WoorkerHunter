import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Ali', description: 'First name of the contact' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s'-]+$/, {
    message: 'firstName must contain only letters, spaces, apostrophes, or dashes',
  })
  firstName: string;

  @ApiProperty({ example: 'Karimov', description: 'Last name of the contact' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s'-]+$/, {
    message: 'lastName must contain only letters, spaces, apostrophes, or dashes',
  })
  lastName: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number in +998 format' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: 'phoneNumber must match +998XXXXXXXXX format',
  })
  phoneNumber: string;

  @ApiProperty({ example: 'Yunusobod 5, Tashkent', description: 'Contact address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Please call after 6 PM', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
