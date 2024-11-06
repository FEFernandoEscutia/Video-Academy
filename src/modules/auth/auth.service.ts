import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaClient, Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';
@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger('Auth Service');
  constructor(private readonly jwtService: JwtService
  ) {
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
    return { message: `welcome in ${dbUser.name}`, token, user: dbUser };
  }

  async signGoogle(authDto: AuthDto) {
    const dbUser = await this.user.findFirst({
      where: { email: authDto.email },
    });
  
    if (!dbUser) {
      throw new BadRequestException('Invalid username or password');
    }
  
    if (authDto.password && !await bcrypt.compare(authDto.password, dbUser.password)) {
      throw new BadRequestException('Invalid username or password');
    }
  
    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      roles: dbUser.role,
    };
  
    const token = this.jwtService.sign(userPayload, { secret: envs.jwtSecret });
    return { message: `Welcome, ${dbUser.name}`, token, user: dbUser };
  }
  
  
  //**************************************** AUTH GOOGLE ************************************************************
  async validateGoogleUser(profileData: any): Promise<any> {

    const DEFAULT_IMAGE_URL = 'https://img.freepik.com/vector-premium/icono-perfil-avatar-predeterminado-imagen-usuario-redes-sociales-icono-avatar-gris-silueta-perfil-blanco-ilustracion-vectorial_561158-3407.jpg?w=740';
    const user = await this.user.upsert({
      where: { email: profileData.email },
      update: {}, // Aquí puedes manejar actualizaciones si es necesario
      create: {
        email: profileData.email,
        name: profileData.name,
        phone: profileData.phone || 'no disponible',
        image: profileData.image || DEFAULT_IMAGE_URL,
        role: 'USER',
        password: 'google-auth', // Proporciona un valor de contraseña por defecto
      },
    });
    return user;
  }
  
  
  

  //***************************************************************** */


}
