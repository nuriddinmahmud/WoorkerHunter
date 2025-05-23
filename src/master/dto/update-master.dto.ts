import {
    IsString,
    IsBoolean,
    IsInt,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    Matches,
    Min,
    Max,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateMasterProfessionDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Profession ID (UUID)', required: false })
    professionId?: string;
  
    @IsOptional()
    @IsInt()
    @ApiProperty({ description: 'Minimum working hours', required: false })
    minWorkingHours?: number;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Level ID (UUID)', required: false })
    levelId?: string;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'Hourly price', example: 100.0, required: false })
    priceHourly?: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'Daily price', example: 600.0, required: false })
    priceDaily?: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'Years of experience', example: 2.5, required: false })
    experience?: number;
  }
  
  export class UpdateMasterDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'John', required: false })
    @Matches(/^[A-Za-z']+$/, { message: 'First name must contain only letters and apostrophes.' })
    firstName?: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Doe', required: false })
    @Matches(/^[A-Za-z']+$/, { message: 'Last name must contain only letters and apostrophes.' })
    lastName?: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: '+998901234567', required: false })
    @Matches(/^\+998[0-9]{9}$/, {
      message: 'Phone number must follow the format: +998XXXXXXXXX',
    })
    phoneNumber?: string;
  
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: true, required: false })
    isActive?: boolean;
  
    @IsOptional()
    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear())
    @ApiProperty({ example: 1990, required: false })
    birthYear?: number;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'img-path.jpg', required: false })
    img?: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'passport-img.jpg', required: false })
    passportImg?: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Skilled craftsman', required: false })
    about?: string;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMasterProfessionDto)
    @ApiProperty({
      type: [UpdateMasterProfessionDto],
      required: false,
      description: 'List of updated master professions',
    })
    masterProfessions?: UpdateMasterProfessionDto[];
  }