import { PrismaService } from 'prisma/prisma.service';
export declare class ScheduleController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSchedule(newSchedule: any): Promise<import(".prisma/client").Schedule>;
    updateSchedule(id: any, updatedSchedule: any): Promise<import(".prisma/client").Schedule>;
}
