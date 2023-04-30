import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';
import { Task, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getAllTasks(query: { filter: string, status: TaskStatus }): Promise<Task[] | null> {
    if (Object.keys(query).length === 0) return this.prisma.task.findMany();

    if (!query.status) query.status = TaskStatus.OPEN;
    return this.prisma.task.findMany(
      {
      where: {
        OR: [
          { title: { contains: query.filter }},
          { description: { contains: query.filter }},
        ],
        status: query.status
      },
    });
  }

   createTask(createTaskDto: CreateTaskDto): Promise<Task | null> {
    const { title, description } = createTaskDto;

    return this.prisma.task.create({
      data: {
        title,
        description,
      },
    });
  }

  async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      }
    });

    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return task;
  }

  async deleteTaskById(id: number): Promise<Task | null> {
    
    await this.getTaskById(id);

    const deletedTask = await this.prisma.task.delete({
      where: {
        id,
      },
    });
    return deletedTask; 
  }

  async updateTaskById(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const { title, description, status } = updateTaskDto;

    return await this.prisma.task.update({
      where: {id}, 
      data: { title, description, status }
    });
  }

}
