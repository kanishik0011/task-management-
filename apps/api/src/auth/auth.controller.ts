import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken: 'jwt-token',
        guest: { id: 'clx_guest_id' }
      }
    }
  })
  createGuest() {
    return this.authService.createGuest();
  }
}
