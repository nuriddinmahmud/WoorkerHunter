import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

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

  @ApiProperty({ example: '123456789', description: 'Soliq ID', required: false })
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

  @ApiProperty({ example: 'NBU', description: 'Bank Name', required: false })
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
}


export class RegisterDTO {
  @ApiProperty({ example: "Prezident" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  @Matches(/^[A-Za-z']+$/, {
    message: 'First name must contain only letters and apostrophes.',
  })
  firstName: string;

  @ApiProperty({ example: "Asilbek" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  @Matches(/^[A-Za-z']+$/, {
    message: 'Last name must contain only letters and apostrophes.',
  })
  lastName: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998[0-9]{9}$/, {
    message: 'Phone number must follow the format: +998XXXXXXXXX',
  })
  phoneNumber: string;

  @ApiProperty({ example: 'Secure123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{5,32}$/, {
    message: 'Password must include at least one letter and one number.',
  })
  password: string;

  @ApiProperty({ example: '7b34a6d6-d302-4bab-9d7c-7e8727e4a903' })
  @IsString()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({ example: 'USER_FIZ', enum: ['USER_FIZ', 'USER_YUR'] })
  @IsString()
  @IsNotEmpty()
  role: 'USER_FIZ' | 'USER_YUR';

  @ApiProperty({
    type: CreateCompanyDto,
    required: false,
    description: 'Company details (required if role is USER_YUR)',
  })
  @Type(() => CreateCompanyDto)
  @ValidateNested()
  @ValidateIf((dto) => dto.role === 'USER_YUR') 
  @IsNotEmpty({ message: 'Company details are required for USER_YUR role' })
  company?: CreateCompanyDto;

}

export class LoginDTO extends PickType(RegisterDTO, [
  'phoneNumber',
  'password',
]) {}

export class SendOtpDto extends PickType(RegisterDTO, ['phoneNumber']) {}

export class VerifyOTPDto extends PickType(RegisterDTO, ['phoneNumber']) {
  @ApiProperty({ example: '472839' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ActivateDto extends PickType(RegisterDTO, ['phoneNumber']) {
  @ApiProperty({ example: '385920' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ResetPasswordDto extends PickType(VerifyOTPDto, ['phoneNumber']) {
  @ApiProperty({ example: 'NewPass2024#' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{5,32}$/, {
    message: 'New password must include at least one letter and one number.',
  })
  newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

