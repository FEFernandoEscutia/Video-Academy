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
@ApiOperation({
  summary: 'Initiate Google Authentication',
  description: 'Redirects the user to Google for authentication.',
})
@ApiResponse({ status: 302, description: 'Redirect to Google authentication.' })
@UseGuards(AuthGuard('google'))
async googleAuth(@Req() req: any) {}

@Get('google/callback1')
@ApiOperation({
  summary: 'Google Authentication Callback',
  description: 'Handles the callback from Google authentication, returning a JWT token along with user details.',
})
@ApiResponse({
  status: 200,
  description: 'User authenticated successfully.',
  schema: {
    example: {
      message: "Welcome Jhon",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTdiMzU3MS1hMGRjLTQwYWYtOWQ1Ny03NDQ1ZjMxZDYyYjgiLCJpZCI6IjAxN2IzNTcxLWEwZGMtNDBhZi05ZDU3LTc0NDVmMzFkNjJiOCIsImVtYWlsIjoiZW5yaXF1ZW1hZXN0cmUyMEBnbWFpbC5jb20iLCJzdGF0dXMiOmZhbHNlLCJyb2xlcyI6IlVTRVIiLCJpYXQiOjE3MzE1NDAwMjMsImV4cCI6MTczMTYyNjQyM30.4inqsSKp7ENTe9W3ElodNw4U5N2NUuKlARuddYHJ0qY",
      user: {
        id: "017b3571-a0dc-40af-9d57-7445f31d62b8",
        email: "jhon1@gmail.com",
        password: null,
        name: "jhon ",
        image: "https://img.freepik.com/vector-premium/icono-perfil-avatar-predeterminado-imagen-usuario-redes-sociales-icono-avatar-gris-silueta-perfil-blanco-ilustracion-vectorial_561158-3407.jpg?w=740",
        role: "USER",
        phone: null,
        isBanned: false
      }
    }
  }
})
@ApiResponse({ status: 403, description: 'Authentication failed.' })
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Req() req: any) {
  await this.userService.upsertGoogleUser(req.user);
  const loggedUserEmail = await this.userService.findOneWEmail(req.user.email);
  return this.authService.signWithGoogle(loggedUserEmail.id);
}


@Get('logout')
@ApiOperation({
  summary: 'Logout user',
  description: 'Clears the JWT token and logs out the user.',
})
@ApiResponse({ status: 200, description: 'User logged out successfully.' })
async logout(@Req() req: any, @Res() res: Response) {
  res.clearCookie('jwt', { path: '/' });
  return res.status(200).json({ message: 'Logged out successfully.' });
}


}
