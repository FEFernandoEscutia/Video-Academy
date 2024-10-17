import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';
@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Auth Service');
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  //****************************************************************************************************
  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  //****************************************************************************************************
  async signIn(authDto: AuthDto) {
    const dbUser = await this.user.findFirst({
      where: { email: authDto.email },
    });
    
    if (!dbUser) {
      throw new BadRequestException('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(
      authDto.password,
      dbUser.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid username or password');
    }
    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      roles: dbUser.role,
    };
    
    const token = this.jwtService.sign(userPayload, { secret: envs.jwtSecret });
    return { message: `welcome in ${dbUser.name}`, token };
  }
  //****************************************************************************************************
}
