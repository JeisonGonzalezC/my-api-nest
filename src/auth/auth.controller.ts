import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() args: AuthLoginDto): { accesToken: string } {
    this.authService.validateUser(args.username, args.password);
    return this.authService.login(args.username);
  }
}
