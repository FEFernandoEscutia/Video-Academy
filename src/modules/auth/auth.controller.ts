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
import { UserService } from '../user/user.service';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @Get('google/callback1')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    await this.userService.upsertGoogleUser(req.user);
    const loggedUserEmail = await this.userService.findOneWEmail(
      req.user.email,
    );
    return this.authService.signWithGoogle(loggedUserEmail.id);
  }

  @Get('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    res.clearCookie('jwt', { path: '/' });

    return res.status(200).json({ message: 'logged out correctly ' });
  }
}
