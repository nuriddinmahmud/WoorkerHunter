import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BasketModule } from './basket/basket.module';
import { BrandModule } from './brand/brand.module';
import { CapacityModule } from './capacity/capacity.module';
// import { CompanyModule } from './company/company.module';
import { CommentModule } from './comment/comment.module';
import { ContactModule } from './contact/contact.module';
import { EskizService } from './eskiz/eskiz.service';
import { FaqModule } from './faq/faq.module';
import { LevelModule } from './level/level.module';
import { MasterModule } from './master/master.module';
import { OrderModule } from './order/order.module';
import { PartnerModule } from './partner/partner.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfessionModule } from './profession/profession.module';
import { RegionModule } from './region/region.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { SitemetadataModule } from './sitemetadata/sitemetadata.module';
import { SizeModule } from './size/size.module';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { ToolModule } from './tool/tool.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AdminModule,
    AuthModule,
    BasketModule,
    BrandModule,
    CapacityModule,
    // CompanyModule,
    CommentModule,
    ContactModule,
    FaqModule,
    LevelModule,
    MasterModule,
    OrderModule,
    PartnerModule,
    PrismaModule,
    ProfessionModule,
    RegionModule,
    ScheduleModule.forRoot(),
    ShowcaseModule,
    SitemetadataModule,
    SizeModule,
    TelegramBotModule,
    ToolModule,
    UploadModule,
    UserModule,
  ],
  controllers: [],
  providers: [EskizService],
})
export class AppModule {}
