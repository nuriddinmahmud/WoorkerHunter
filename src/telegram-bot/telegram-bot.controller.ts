import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { CreateTelegramBotDto } from './dto/create-telegram-bot.dto';
import { UpdateTelegramBotDto } from './dto/update-telegram-bot.dto';

@Controller('telegram-bot')
export class TelegramBotController {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  // @Post()
  // create(@Body() createTelegramBotDto: CreateTelegramBotDto) {
  //   return this.telegramBotService.create(createTelegramBotDto);
  // }

  // @Get()
  // findAll() {
  //   return this.telegramBotService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.telegramBotService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTelegramBotDto: UpdateTelegramBotDto) {
  //   return this.telegramBotService.update(+id, updateTelegramBotDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.telegramBotService.remove(+id);
  // }
}
