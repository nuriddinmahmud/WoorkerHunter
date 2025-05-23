import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    Min,
    Max,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateMasterRatingDto {
    @ApiProperty({ example: 'MasterID', required: false, description: 'ID of an existing master' })
    @IsOptional()
    @IsString()
    masterId?: string;
  
    @ApiProperty({ example: 4.5, required: false, description: 'Star rating (0 to 5)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    star?: number;
  }
  
  export class UpdateCommentDto {
    @ApiProperty({ example: 'Updated comment message', required: false, description: 'Comment message' })
    @IsOptional()
    @IsString()
    message?: string;
  
    @ApiProperty({
      type: [UpdateMasterRatingDto],
      required: false,
      description: 'List of updated master ratings',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMasterRatingDto)
    masterRatings?: UpdateMasterRatingDto[];
  }