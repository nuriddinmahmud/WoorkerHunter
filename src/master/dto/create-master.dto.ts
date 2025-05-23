import {
    IsString,
    IsBoolean,
    IsInt,
    IsArray,
    ValidateNested,
    IsOptional,
    IsNumber,
    IsNotEmpty,
    Matches,
    Min,
    Max,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateMasterProfessionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Profession ID (UUID)', example: 'uuid' })
    professionId: string;
  
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ description: 'Minimum working hours', example: 3, required: false })
    minWorkingHours?: number;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Level ID (UUID)', example: 'uuid', required: false })
    levelId?: string;
  
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Hourly price', example: 120.0 })
    priceHourly: number;
  
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Daily price', example: 800.0 })
    priceDaily: number;
  
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Years of experience', example: 5 })
    experience: number;
  }
  
  export class CreateMasterDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'John', description: 'First name' })
    @Matches(/^[A-Za-z']+$/, { message: 'First name must contain only letters and apostrophes.' })
    firstName: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Doe', description: 'Last name' })
    @Matches(/^[A-Za-z']+$/, { message: 'Last name must contain only letters and apostrophes.' })
    lastName: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '+998901234567', description: 'Phone number' })
    @Matches(/^\+998[0-9]{9}$/, {
        message: 'Phone number must follow the format: +998XXXXXXXXX',
    })
    phoneNumber: string;
  
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: true, description: 'Is active status', required: false })
    isActive?: boolean;
  
    @IsNotEmpty()
    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear())
    @ApiProperty({ example: 1985, description: 'Birth year' })
    birthYear: number;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'img-path.jpg', description: 'Image path' })
    img: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'passport-img.jpg', description: 'Passport image path' })
    passportImg: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Experienced carpenter...', description: 'About the master' })
    about: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMasterProfessionDto)
    @ApiProperty({
      type: [CreateMasterProfessionDto],
      description: 'List of master professions',
    })
    masterProfessions: CreateMasterProfessionDto[];
  }