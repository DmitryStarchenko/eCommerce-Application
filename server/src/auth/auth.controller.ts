import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('anonymous/token')
  createAnonymousToken() {
    return this.authService.createAnonymousToken();
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      addresses?: { streetName: string; city: string; country: string }[];
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body()
    body: {
      id: string;
      version: number;
      currentPassword: string;
      newPassword: string;
    },
  ) {
    return this.authService.changePassword(body);
  }

  @Post('refresh')
  refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body.refresh_token);
  }
}
