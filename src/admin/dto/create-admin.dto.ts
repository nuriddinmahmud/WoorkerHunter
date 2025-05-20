export class CreateAddAdminDto {}
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsIn,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  VIEWER_ADMIN = 'VIEWER_ADMIN',
  USER_FIZ = 'USER_FIZ',
  USER_YUR = 'USER_YUR',
}

export class AddAdminDto {
  @ApiProperty({ example: 'Dilshodbek' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  @Matches(/^[A-Za-z']+$/, {
    message: 'First name must contain only letters and apostrophes.',
  })
  firstName: string;

  @ApiProperty({ example: "Khodjakov" })
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

  @ApiProperty({ example: '8faff4b9-dfdc-4ef1-b57f-9dc949f6d256' })
  @IsString()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({
    example: 'ADMIN',
    enum: ['ADMIN', 'SUPER_ADMIN', 'VIEWER_ADMIN'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMIN', 'SUPER_ADMIN', 'VIEWER_ADMIN'])
  role: 'ADMIN' | 'SUPER_ADMIN' | 'VIEWER_ADMIN';
}
