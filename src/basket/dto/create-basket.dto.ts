import {
    IsString,
    IsOptional,
    IsNumber,
    Min,
    Max,
    IsEnum,
  } from 'class-validator';
  // import { TimeUnit } from '@prisma/client';
  import { ApiProperty } from '@nestjs/swagger';

  export enum TimeUnit {
    HOURLY='HOURLY',
    DAILY='DAILY',
  }
  
  
  export class CreateBasketDto {
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
  
    @ApiProperty({ example: 1, description: 'Quantity', minimum: 1 })
    @IsNumber()
    @Min(1)
    quantity: number;
  
    @ApiProperty({ enum: TimeUnit, example: 'HOURLY or DAILY', description: 'Time unit' })
    @IsEnum(TimeUnit)
    timeUnit?: TimeUnit;
  
    @ApiProperty({ example: 8, description: 'Working time in hours/days' })
    @IsNumber()
    @Min(1)
    workingTime?: number;
  
    @ApiProperty({ example: 100.5, description: 'Price' })
    @IsNumber()
    @Min(0)
    price: number;
  }