import {
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsNumber,
    Min,
    Max,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateMasterRatingDto {
    @ApiProperty({ example: 'MasterID', description: 'ID of an existing master' })
    @IsString()
    @IsNotEmpty()
    masterId: string;
  
    @ApiProperty({ example: 4.5, description: 'Star rating (0 to 5)' })
    @IsNumber()
    @Min(0)
    @Max(5)
    star: number;
  }
  
  export class CreateCommentDto {
    @ApiProperty({ example: 'USTOZ baribir yaxshida!', description: 'Comment message' })
    @IsString()
    @IsNotEmpty()
    message: string;
  
    @ApiProperty({ example: 'OrderID', description: 'ID of an existing order' })
    @IsString()
    @IsNotEmpty()
    orderId: string;
  
    @ApiProperty({
      type: [CreateMasterRatingDto],
      description: 'List of master ratings',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMasterRatingDto)
    masterRatings: CreateMasterRatingDto[];
  }