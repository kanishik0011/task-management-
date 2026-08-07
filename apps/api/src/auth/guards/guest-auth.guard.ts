import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

export type GuestRequest = Request & {
  guest: {
    id: string;
  };
};

@Injectable()
export class GuestAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Guest session is required.');
    }

    const guest = await this.authService.verifyGuestToken(token);
    if (!guest) {
      throw new UnauthorizedException('Guest session is invalid or expired.');
    }

    (request as GuestRequest).guest = guest;
    return true;
  }

  private extractBearerToken(request: Request) {
    const header = request.headers.authorization;
    const [scheme, token] = header?.split(' ') ?? [];
    return scheme === 'Bearer' ? token : undefined;
  }
}
