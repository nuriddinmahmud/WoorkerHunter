import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; 
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EskizModule } from 'src/eskiz/eskiz.module';

@Module({
  imports: [
    PrismaModule,
    EskizModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  controllers: [AuthController], 
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
