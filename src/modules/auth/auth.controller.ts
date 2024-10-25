import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'User Sign In',
    description: `Authenticates a user by validating their email and password. Returns a JWT token if the credentials are valid.`,
  })
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}
