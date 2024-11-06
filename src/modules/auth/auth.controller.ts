import { Controller, Post, Body, UseInterceptors, Req, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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


 
  
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}


  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    console.log(req.user);
    const response = await this.authService.signGoogle(req.user.id);
     
    res.redirect(`http://localhost:3000?token=${response.token}`);
  }
  
}
