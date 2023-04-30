import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from '@prisma/client';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() query: { filter: string, status: TaskStatus }): Promise<Task[] | null> {
    return this.tasksService.getAllTasks(query);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task | null> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task | null> {
    return this.tasksService.getTaskById(id);
  }
  
  @Put('/:id')
  updateTaskById(@Param('id', ParseIntPipe) id: number, @Body(TaskStatusValidationPipe) updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    return this.tasksService.updateTaskById(id, updateTaskDto);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id:number) {
    return this.tasksService.deleteTaskById(id);
  }

}
