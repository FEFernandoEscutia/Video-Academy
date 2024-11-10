import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from 'src/config/google-oauth.config';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user:any) => void, ): Promise<any> {
    try {
      
      const user = await this.authService.validateGoogleUser({
        email: profile.emails[0].value,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        phone: `Phone-Not-Available-${profile.emails[0].value}`,
        image: profile.photos?.[0]?.value || 'default-image-url',
        accessToken
      
      });

   
    
     done(null, user);
    } catch (error) {
      console.error("Error in Google OAuth validation:", error);
      return done(error, false);
    }
  }
  
  
  }
