import {
    IsString,
    IsOptional,
    IsNumber,
    Min,
    Max,
    IsEnum,
  } from 'class-validator';
  // import { TimeUnit } from '@prisma/client';
  import { TimeUnit } from './create-basket.dto'
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateBasketDto {
    @ApiProperty({ example: 'ProfessionID', required: false })
    @IsOptional()
    @IsString()
    professionId?: string;
  
    @ApiProperty({ example: 'ToolID', required: false })
    @IsOptional()
    @IsString()
    toolId?: string;
  
    @ApiProperty({ example: 'LevelID', required: false })
    @IsOptional()
    @IsString()
    levelId?: string;
  
    @ApiProperty({ example: 1, description: 'Quantity', required: false, minimum: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    quantity?: number;
  
    @ApiProperty({ enum: TimeUnit, example: 'HOURLY or DAILY', required: false, description: 'Time unit' })
    @IsOptional()
    @IsEnum(TimeUnit)
    timeUnit?: TimeUnit;
  
    @ApiProperty({ example: 8, description: 'Working time in hours/days', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    workingTime?: number;
  
    @ApiProperty({ example: 100.5, description: 'Price', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;
  }