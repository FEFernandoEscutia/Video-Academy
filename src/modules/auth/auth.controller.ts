import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Req,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { GoogleAuthGuard } from 'src/guards/google.oauth.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'User Sign In',
    description: `Authenticates a user by validating their email and password. Returns a JWT token if the credentials are valid.`,
  })
  @UseInterceptors(AuthInterceptor)
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  //*************************** auth Google ************************** */

  @ApiResponse({
    status: 302,
    description: 'Redirects to Google for authentication',
  })
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @ApiOperation({
    summary: 'Handle Google authentication callback',
    description:
      'Receives the callback from Google after user authentication, then redirects to the frontend with a JWT token.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the frontend with JWT token in the URL',
    headers: {
      Location: {
        description: 'URL with JWT token parameter',
        schema: {
          type: 'string',
          example: 'http://localhost:3000?token=your-jwt-token',
        },
      },
    },
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.signGoogle(req.user.id);
    res.redirect(
      `https://video-academy.onrender.com/api?token=${response.token}`,
    );
  }
}
