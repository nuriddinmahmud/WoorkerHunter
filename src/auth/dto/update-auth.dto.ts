import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAuthDto {
  @ApiProperty({ example: 'Nuriddin Mahmud' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  full_name?: string;

  @ApiProperty({ example: 'region_id' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  region_id?: string;
}
