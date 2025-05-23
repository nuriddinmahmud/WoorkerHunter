import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EskizService } from 'src/eskiz/eskiz.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService, EskizService],
})
export class AuthModule {}
