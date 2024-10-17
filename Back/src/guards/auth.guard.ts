import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import dayjs from 'dayjs';
import { envs } from 'src/config';
  
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      
      const token = request.headers['authorization']?.split(' ')[1] ?? '';
      if (!token) {
        throw new UnauthorizedException('Bearer token not found');
      }
      
      
      try {
        const secret = envs.jwtSecret;
        const payload = await this.jwtService.verifyAsync(token, { secret });
        request.user = payload;
        return true;
      } catch (error) {
        const secret = envs.jwtSecret;
        const payload = await this.jwtService.verifyAsync(token, { secret });
        console.log(payload);
        console.log('Error verifying token:', error.message);
        throw new UnauthorizedException('Invalid Token');
      }
    }
  }
  