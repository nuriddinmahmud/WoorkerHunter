import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TelegramBotModule],
})
export class OrderModule {}
