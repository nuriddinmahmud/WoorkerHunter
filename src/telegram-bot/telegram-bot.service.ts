import { Injectable } from '@nestjs/common';
import { CreateTelegramBotDto } from './dto/create-telegram-bot.dto';
import { UpdateTelegramBotDto } from './dto/update-telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  create(createTelegramBotDto: CreateTelegramBotDto) {
    return 'This action adds a new telegramBot';
  }

  findAll() {
    return `This action returns all telegramBot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} telegramBot`;
  }

  update(id: number, updateTelegramBotDto: UpdateTelegramBotDto) {
    return `This action updates a #${id} telegramBot`;
  }

  remove(id: number) {
    return `This action removes a #${id} telegramBot`;
  }
}
