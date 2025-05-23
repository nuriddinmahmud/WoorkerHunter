import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramBotService {
  private bot: Telegraf;
  private admins: Map<number, string> = new Map(); // userId -> name
  private adminGroupId: number;

  constructor(private prisma: PrismaService) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
    this.adminGroupId = parseInt(process.env.ADMIN_GROUP_ID!);

    // Start command - just ask for name
    this.bot.start((ctx) => {
      ctx.reply('Assalomu alaykum! Iltimos, ismingizni kiriting:');
      this.admins.set(ctx.from.id, 'Guest');
    });

    // On first message, treat as name input
    this.bot.on('text', (ctx) => {
      const name = ctx.message.text.trim();
      this.admins.set(ctx.from.id, name);
      ctx.reply(`Rahmat, ${name}! Sizga endi yangi buyurtmalar haqida xabar yuboriladi.`);
    });

    this.bot.launch();
  }

  /**
   * Boshqa joydan bu metod chaqiriladi order yaratilganda
   */
  public async notifyNewOrder(order: any, orderProducts: any[]) {
    const owner = await this.prisma.user.findUnique({
      where: { id: order.ownerId },
    });

    const productDetails = await this.formatOrderProducts(orderProducts);

    const message = `
🔔 Yangi buyurtma kelib tushdi!

🆔 Order ID: ${order.id}
👤 Buyurtmachi: ${owner?.firstName} ${owner?.lastName} (${owner?.phoneNumber})
📍 Manzil: ${order.address}
💵 Narx: ${order.totalPrice}
💳 To'lov: ${order.paymentType}
📦 Status: ${order.status}

🛒 Buyurtma tarkibi:
${productDetails}
    `;

    await this.bot.telegram.sendMessage(this.adminGroupId, message);
  }

  private async formatOrderProducts(orderProducts: any[]): Promise<string> {
    const lines: string[] = [];

    for (let i = 0; i < orderProducts.length; i++) {
      const item = orderProducts[i];
      const index = i + 1;

      if (item.professionId) {
        const [profession, level] = await Promise.all([
          this.prisma.profession.findUnique({ where: { id: item.professionId } }),
          this.prisma.level.findUnique({ where: { id: item.levelId } }),
        ]);

        if (profession && level) {
          lines.push(`
${index}. 👷‍♂️ Kasb:
🔹 Nomi: ${profession.nameUz}
🆔 ID: ${profession.id}
🏷️ Darajasi: ${level.nameUz}
📦 Soni: ${item.quantity}
⏳ Davriyligi: ${item.timeUnit}
🕒 Ish vaqti: ${item.workingTime}
💰 Narxi: ${item.price}`);
        }

      } else if (item.toolId) {
        const tool = await this.prisma.tool.findUnique({ where: { id: item.toolId } });

        if (tool) {
          lines.push(`
${index}. 🛠️ Asbob:
🔹 Nomi: ${tool.nameUz}
🆔 ID: ${tool.id}
📦 Soni: ${item.quantity}
💰 Narxi: ${item.price}`);
        }
      }
    }

    return lines.join('\n');
  }
}
