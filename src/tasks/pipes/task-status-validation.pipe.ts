import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { TaskStatus } from "@prisma/client";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatusses = [
        TaskStatus.OPEN,
        TaskStatus.INPROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: UpdateTaskDto) {
        const { status, title, description } = value;

        if (!status || !title || !description) throw new BadRequestException(`Data is missing`);
        
        if(!this.isStatusValid(status)) throw new BadRequestException(`${status} is an invalid status`);

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatusses.indexOf(status);
        return idx !== -1;
    }
}