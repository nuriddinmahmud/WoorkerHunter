import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token!');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided!');
    }

    try {
      
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_SECRET,
      });
      
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token!');
    }
    return true;
  }
}
