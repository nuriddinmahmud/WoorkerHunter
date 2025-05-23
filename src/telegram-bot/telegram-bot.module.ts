import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TelegramBotService, PrismaModule],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}