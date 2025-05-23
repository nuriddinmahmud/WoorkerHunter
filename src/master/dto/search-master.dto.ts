import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export enum Sort {
    firstName = 'firstName',
    lastName = 'lastName',
    isActive = 'isActive',
    birthYear = 'birthYear',
    createdAt = 'createdAt',
  }
  
  export enum SearchSort {
    minWorkingHours = 'minWorkingHours',
    priceHourly = 'priceHourly',
    priceDaily = 'priceDaily',
    experience = 'experience',
  }
  
export class QueryMasterDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName?: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    phoneNumber?: string;
  
    @IsOptional()
    @IsEnum(['true', 'false'])
    @IsNotEmpty()
    isActive?: string;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1900)
    birthYear?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1900)
    maxYear?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1900)
    minYear?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
  
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    orderBy?: 'asc' | 'desc';
  
    @IsOptional()
    @IsEnum(Sort)
    sortBy?: Sort;
  }

export class SearchMasterDto extends PickType(QueryMasterDto, [
    'page',
    'limit',
    'orderBy',
  ]) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    levelId?: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    professionId?: string;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    minWorkingHours?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    gteMinWorkingHours?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    lteMinWorkingHours?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    priceHourly?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    gtePriceHourly?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    ltePriceHourly?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    priceDaily?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    gtePriceDaily?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    ltePriceDaily?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    experience?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    gteExperience?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    lteExperience?: number;
  
    @IsOptional()
    @IsEnum(SearchSort)
    sortBy?: SearchSort;
  }
