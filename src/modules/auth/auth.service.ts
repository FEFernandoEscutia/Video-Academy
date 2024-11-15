import {
  BadRequestException,
  ForbiddenException,
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
      include: {
        favorites: true,
      },
    });
    const dbUser2 = await this.user.findFirst({
      where: { email: authDto.email },
      include: {
        courses: true,
      },
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
      status: dbUser.isBanned,
      roles: dbUser.role,
    };
    if (dbUser.isBanned === true) {
      throw new ForbiddenException(
        'You are banned please get in touch with us through the admin email consolelearncomp@gmail.com',
      );
    }
    if (dbUser.role === Role.ADMIN) {
      const courses = await this.course.findMany({});
      for (const course of courses) {
        if (dbUser2.courses.some((c) => c.id === course.id)) {
          continue;
        }
        await this.user.update({
          where: { id: dbUser2.id },
          data: {
            courses: {
              connect: { id: course.id },
            },
          },
        });
      }
    }
    const token = this.jwtService.sign(userPayload, { secret: envs.jwtSecret });
    return { message: `welcome in ${dbUser.name}`, token, user: dbUser };
  }

  //**************************** GOOGLE SIGNIN************************************* */

  async signWithGoogle(userId: string) {
    const dbUser = await this.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      throw new BadRequestException('User not found');
    }

    if (dbUser.isBanned) {
      throw new ForbiddenException('You are banned. Please contact the admin.');
    }

    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      status: dbUser.isBanned,
      roles: dbUser.role,
    };

    try {
      const token = this.jwtService.sign(userPayload, {
        secret: process.env.JWT_SECRET,
      });

      return { message: `Welcome ${dbUser.name}`, token, user: dbUser };
    } catch (error) {
      console.error('Error signing token:', error);
      throw new BadRequestException('Error generating token');
    }
  }

  //**************************************** VALIDATE PROFILE AUTH GOOGLE ************************************************************
  async validateGoogleUser(profileData: any): Promise<any> {
    const DEFAULT_IMAGE_URL =
      'https://img.freepik.com/vector-premium/icono-perfil-avatar-predeterminado-imagen-usuario-redes-sociales-icono-avatar-gris-silueta-perfil-blanco-ilustracion-vectorial_561158-3407.jpg?w=740';
    const uniquePhone =
      profileData.phone || `Phone-Not-Available-${profileData.emails[0].value}`;
    const uniquePassword = `GoogleAuth-${profileData.email}`;
    const user = await this.user.upsert({
      where: { email: profileData.email },
      update: {},
      create: {
        email: profileData.email,
        name: profileData.name,
        phone: uniquePhone,
        image: profileData.image || DEFAULT_IMAGE_URL,
        role: 'USER',
        password: uniquePassword,
      },
    });
    return user;
  }

  //***************************************************************** */

  async validateUser(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }

  async login(user: User) {
    const payload = { role: user.role, status: user.isBanned, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
