import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from 'src/config/google-oauth.config';
import { AuthService } from './auth.service';

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

  async validate(
    token: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile);
      const user = await this.authService.validateGoogleUser({
        email: profile.emails[0].value,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        phone: profile.phoneNumbers?.[0]?.value || `Phone-Not-Available-${profile.emails[0].value}`, // Solo pasa el teléfono si está disponible
        image: profile.photos?.[0]?.value || 'default-image-url', 
  });
  done(null, user);
}
  }
