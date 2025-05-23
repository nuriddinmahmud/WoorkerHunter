import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqDto } from './create-faq.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
  @ApiPropertyOptional({ description: 'Updated question in Uzbek', example: 'Yangi savol?' })
  questionUz?: string;

  @ApiPropertyOptional({ description: 'Updated answer in Uzbek', example: 'Yangi javob.' })
  answerUz?: string;

  @ApiPropertyOptional({ description: 'Updated question in Russian', example: 'Новый вопрос?' })
  questionRu?: string;

  @ApiPropertyOptional({ description: 'Updated answer in Russian', example: 'Новый ответ.' })
  answerRu?: string;

  @ApiPropertyOptional({ description: 'Updated question in English', example: 'New question?' })
  questionEn?: string;

  @ApiPropertyOptional({ description: 'Updated answer in English', example: 'New answer.' })
  answerEn?: string;
}
