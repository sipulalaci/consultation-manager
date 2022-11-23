import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body()
    registerDto: {
      name: string;
      email: string;
      password: string;
      type: UserType;
      neptun?: string;
      department?: string;
    },
  ) {
    return this.authService.register(registerDto);
  }
}
