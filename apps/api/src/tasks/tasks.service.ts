import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(guestId: string) {
    return this.prisma.task.findMany({
      where: { guestId },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }]
    });
  }

  async findOne(guestId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, guestId }
    });

    if (!task) {
      throw new NotFoundException('Task was not found.');
    }

    return task;
  }

  create(guestId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: this.mapCreateDto(guestId, dto)
    });
  }

  async update(guestId: string, id: string, dto: UpdateTaskDto) {
    await this.ensureTaskExists(guestId, id);

    return this.prisma.task.update({
      where: { id },
      data: this.mapUpdateDto(dto)
    });
  }

  async remove(guestId: string, id: string) {
    await this.ensureTaskExists(guestId, id);
    await this.prisma.task.delete({ where: { id } });
  }

  private async ensureTaskExists(guestId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, guestId },
      select: { id: true }
    });

    if (!task) {
      throw new NotFoundException('Task was not found.');
    }
  }

  private mapCreateDto(guestId: string, dto: CreateTaskDto): Prisma.TaskUncheckedCreateInput {
    return {
      guestId,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
    };
  }

  private mapUpdateDto(dto: UpdateTaskDto): Prisma.TaskUncheckedUpdateInput {
    return {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
    };
  }
}
