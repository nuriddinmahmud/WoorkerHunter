import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsPositive,
  ValidateNested,
  Matches,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

const regexUzRuEn = /^[\p{L}0-9\s.'\-]+$/u;

export class LevelProfessionDto {
  @ApiProperty({ example: 'LevelID' })
  @IsString()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  @Max(24)
  @IsNotEmpty()
  minWorkingHours: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  priceHourly: number;

  @ApiProperty({ example: 400000 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  priceDaily: number;
}

export class CreateProfessionDto {
  @ApiProperty({ example: "Elektrik", description: "Profession name in Uzbek" })
  @IsNotEmpty()
  @IsString()
  @Matches(regexUzRuEn, { message: 'nameUz must contain only letters, numbers, spaces, dots, dashes or apostrophes' })
  nameUz: string;

  @ApiProperty({ example: "Электрик", description: "Profession name in Russian", required: false })
  @IsOptional()
  @IsString()
  @Matches(regexUzRuEn, { message: 'nameRu must contain only letters, numbers, spaces, dots, dashes or apostrophes' })
  nameRu?: string;

  @ApiProperty({ example: "Electrician", description: "Profession name in English", required: false })
  @IsOptional()
  @IsString()
  @Matches(regexUzRuEn, { message: 'nameEn must contain only letters, numbers, spaces, dots, dashes or apostrophes' })
  nameEn?: string;

  @ApiProperty({ example: 'electrician.jpg', description: 'Image file name' })
  @IsString()
  @IsNotEmpty()
  img: string;

  @ApiProperty({ example: true, description: 'Profession status (ACTIVE(true)/INACTIVE(false)' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    type: [LevelProfessionDto],
    description: 'Array of profession levels with pricing info',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LevelProfessionDto)
  professionLevels: LevelProfessionDto[];

  @ApiProperty({
    example: ['toolId1', 'toolId2'],
    description: 'Array of related tool IDs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  professionTools: string[];
}
