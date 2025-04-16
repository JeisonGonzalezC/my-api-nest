import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(user: string, pass: string): boolean {
    const envUser = process.env.AUTH_USER;
    const envPass = process.env.AUTH_PASSWORD;

    if (user === envUser && pass === envPass) return true;
    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: string): { accesToken: string } {
    const payload = { username: user };
    const accesToken = this.jwtService.sign(payload);
    return {
      accesToken,
    };
  }
}
