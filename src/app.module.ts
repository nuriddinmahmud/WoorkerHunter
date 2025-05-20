import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RegionModule } from './region/region.module';
import { CompanyModule } from './company/company.module';
import { ToolModule } from './tool/tool.module';
import { MasterModule } from './master/master.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';
import { BasketModule } from './basket/basket.module';
import { FaqModule } from './faq/faq.module';
import { PartnerModule } from './partner/partner.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { SiteMetadataModule } from './site-metadata/site-metadata.module';
import { ProfessionModule } from './profession/profession.module';
import { SizeModule } from './size/size.module';
import { BrandModule } from './brand/brand.module';
import { LevelModule } from './level/level.module';
import { ContactModule } from './contact/contact.module';
import { CapacityModule } from './capacity/capacity.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { EskizService } from './eskiz/eskiz.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    AuthModule,
    UserModule,
    RegionModule,
    CompanyModule,
    ToolModule,
    MasterModule,
    OrderModule,
    CommentModule,
    BasketModule,
    FaqModule,
    PartnerModule,
    ShowcaseModule,
    SiteMetadataModule,
    ProfessionModule,
    SizeModule,
    BrandModule,
    LevelModule,
    ContactModule,
    CapacityModule,
    PrismaModule,
    TelegramBotModule,
    AdminModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, EskizService],
})
export class AppModule {}
