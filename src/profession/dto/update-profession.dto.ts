import { PartialType } from '@nestjs/swagger';
import { CreateProfessionDto } from './create-profession.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsPositive,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLevelProfessionDto {
  @ApiPropertyOptional({ example: 'levelId', description: 'LevelID' })
  @IsOptional()
  @IsString()
  levelId?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  minWorkingHours?: number;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceHourly?: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceDaily?: number;
}

export class UpdateProfessionDto {
  @ApiPropertyOptional({ example: 'Plumber' })
  @IsOptional()
  @IsString()
  @Matches(/^[\p{L}0-9\s.'\-]+$/u, {
    message: 'nameUz must contain only letters, numbers, spaces, dots, dashes or apostrophes',
  })
  nameUz?: string;

  @ApiPropertyOptional({ example: 'Пломбир' })
  @IsOptional()
  @IsString()
  @Matches(/^[\p{L}0-9\s.'\-]+$/u, {
    message: 'nameRu must contain only letters, numbers, spaces, dots, dashes or apostrophes',
    })
  nameRu?: string;

  @ApiPropertyOptional({ example: 'Plumber' })
  @IsOptional()
  @IsString()
  @Matches(/^[\p{L}0-9\s.'\-]+$/u, {
    message: 'nameEn must contain only letters, numbers, spaces, dots, dashes or apostrophes',
    })
  nameEn?: string;

  @ApiPropertyOptional({ example: 'new-plumber.jpg' })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [UpdateLevelProfessionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLevelProfessionDto)
  professionLevels?: UpdateLevelProfessionDto[];

  @ApiPropertyOptional({ example: ['toolId1', 'toolId2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professionTools?: string[];
}
