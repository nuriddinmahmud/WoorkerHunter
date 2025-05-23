// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   MaxLength,
//   MinLength,
// } from 'class-validator';

// export class UpdateAuthDto {
//   @ApiProperty({ example: 'Alex Fergison' })
//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(32)
//   @MinLength(2)
//   full_name?: string;

//   @ApiProperty({ example: 'region_id' })
//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   region_id?: string;
// }

// // import { PartialType, PickType } from '@nestjs/swagger';
// // import { CreateAuthDto } from './create-auth.dto';

// // export class UpdateAuthDto extends PartialType(
// //   PickType(CreateAuthDto, ['full_name', 'region_id']),
// // ) {}
