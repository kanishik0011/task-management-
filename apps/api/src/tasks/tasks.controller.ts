import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { GuestAuthGuard, GuestRequest } from '../auth/guards/guest-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(GuestAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOkResponse({ description: 'Guest-scoped task list' })
  findAll(@Req() request: GuestRequest) {
    return this.tasksService.findAll(request.guest.id);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Task details' })
  findOne(@Req() request: GuestRequest, @Param('id') id: string) {
    return this.tasksService.findOne(request.guest.id, id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Task created' })
  create(@Req() request: GuestRequest, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(request.guest.id, dto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Task updated' })
  update(
    @Req() request: GuestRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.update(request.guest.id, id, dto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Task deleted' })
  async remove(@Req() request: GuestRequest, @Param('id') id: string) {
    await this.tasksService.remove(request.guest.id, id);
  }
}
