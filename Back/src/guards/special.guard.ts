import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';

@Injectable()
export class SpecialGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1] ?? '';
    if (token) {
      const secret = envs.jwtSecret;
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request.user = payload;
      return true;
    }

    return true;
  }
}
