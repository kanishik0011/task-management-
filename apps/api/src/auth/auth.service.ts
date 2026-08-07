import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Priority, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type GuestTokenPayload = {
  sub: string;
  type: 'guest';
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async createGuest() {
    const guest = await this.prisma.guest.create({ data: {} });

    await this.prisma.task.createMany({
      data: [
        {
          guestId: guest.id,
          title: 'Review product requirements',
          description: 'Clarify scope, empty states, and review criteria before implementation.',
          status: TaskStatus.TODO,
          priority: Priority.HIGH,
          dueDate: this.daysFromNow(1)
        },
        {
          guestId: guest.id,
          title: 'Build task CRUD flow',
          description: 'Create, edit, update status, and delete with safe confirmations.',
          status: TaskStatus.IN_PROGRESS,
          priority: Priority.MEDIUM,
          dueDate: this.daysFromNow(3)
        },
        {
          guestId: guest.id,
          title: 'Document deployment steps',
          description: 'Capture environment variables, API URLs, and production checks.',
          status: TaskStatus.DONE,
          priority: Priority.LOW,
          dueDate: this.daysFromNow(5)
        }
      ]
    });

    const payload: GuestTokenPayload = { sub: guest.id, type: 'guest' };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: '7d'
    });

    return {
      accessToken,
      guest: { id: guest.id }
    };
  }

  async verifyGuestToken(token: string) {
    const payload = await this.jwtService.verifyAsync<GuestTokenPayload>(token, {
      secret: this.jwtSecret
    });

    if (payload.type !== 'guest') {
      return null;
    }

    const guest = await this.prisma.guest.findUnique({
      where: { id: payload.sub },
      select: { id: true }
    });

    return guest;
  }

  private get jwtSecret() {
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is required');
    }
    return secret;
  }

  private daysFromNow(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}
