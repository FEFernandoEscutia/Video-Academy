import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../guards/auth.guard';
import { envs } from 'src/config';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { EmailService } from 'src/emails/emails.service';
// import { ConfigModule } from '@nestjs/config';
// import googleOAuthConfig from 'src/config/google-oauth.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService,  GoogleStrategy, AuthGuard, UserService, EmailService],

  exports: [AuthGuard],
})
export class AuthModule {}
