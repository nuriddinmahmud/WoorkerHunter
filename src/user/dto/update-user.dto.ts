import { IsOptional, IsString, IsEnum, IsUUID, Matches, ValidateIf, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
// import { UserStatus } from '@prisma/client';
import { CreateCompanyDto } from '../../auth/dto/create-auth.dto';
import { Type } from 'class-transformer';

export enum UserStatus {
  ACTIVE='ACTIVE',
  INACTIVE='INACTIVE',
  BANNED='BANNED',
}


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

  @ApiPropertyOptional({ example: 'NBU', description: 'Updated bank name' })
  bankName?: string;

  @ApiPropertyOptional({ example: '12345', description: 'Updated OKED' })
  oked?: string;

  @ApiPropertyOptional({ example: 'Chilonzor, Tashkent', description: 'Updated address' })
  address?: string;
}


export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'First name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString({ message: 'firstName must be a string' })
  @Matches(/^[A-Za-z']+$/, { message: 'firstName can only contain letters and apostrophes' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsOptional()
  @IsString({ message: 'lastName must be a string' })
  @Matches(/^[A-Za-z']+$/, { message: 'lastName can only contain letters and apostrophes' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'ID of the region the user belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('all', { message: 'regionId must be a valid UUID' })
  regionId?: string;

  // @ApiPropertyOptional({
  //   description: 'Status of the user',
  //   example: 'ACTIVE',
  //   enum: UserStatus,
  // })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'status must be a valid user status' })
  status?: UserStatus;
  
  @ApiPropertyOptional({
    type: UpdateCompanyDto,
    required: false,
    description: 'Updated company details (required if role is USER_FIZ)',
  })
  @Type(() => UpdateCompanyDto)
  @ValidateNested()
  @ValidateIf((dto) => dto.role === 'USER_FIZ') 
  @IsOptional()
  company?: UpdateCompanyDto;

}
