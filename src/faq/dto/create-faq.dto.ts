import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ description: 'FAQ question in Uzbek', example: 'Bu nima?' })
  @IsNotEmpty({ message: 'questionUz is required' })
  @IsString({ message: 'questionUz must be a string' })
  questionUz: string;

  @ApiProperty({ description: 'FAQ answer in Uzbek', example: 'Bu test javobi.' })
  @IsNotEmpty({ message: 'answerUz is required' })
  @IsString({ message: 'answerUz must be a string' })
  answerUz: string;

  @ApiProperty({ description: 'FAQ question in Russian', required: false, example: 'Что это?' })
  @IsOptional()
  @IsString({ message: 'questionRu must be a string' })
  @Matches(/^[А-Яа-яЁё0-9\s.,!?'"«»()\-–—:;]+$/, {
    message: 'questionRu can only contain Russian letters and valid characters',
  })
  questionRu?: string;

  @ApiProperty({ description: 'FAQ answer in Russian', required: false, example: 'Это тестовый ответ.' })
  @IsOptional()
  @IsString({ message: 'answerRu must be a string' })
  @Matches(/^[А-Яа-яЁё0-9\s.,!?'"«»()\-–—:;]+$/, {
    message: 'answerRu can only contain Russian letters and valid characters',
  })
  answerRu?: string;

  @ApiProperty({ description: 'FAQ question in English', required: false, example: 'What is this?' })
  @IsOptional()
  @IsString({ message: 'questionEn must be a string' })
  questionEn?: string;

  @ApiProperty({ description: 'FAQ answer in English', required: false, example: 'This is a test answer.' })
  @IsOptional()
  @IsString({ message: 'answerEn must be a string' })
  answerEn?: string;
}
