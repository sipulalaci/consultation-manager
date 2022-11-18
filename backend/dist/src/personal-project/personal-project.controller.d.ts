import { PrismaService } from 'prisma/prisma.service';
export declare class PersonalProjectController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPersonalProject(newPersonalProject: any): Promise<import(".prisma/client").PersonalProject>;
    getPersonalProject(id: string): Promise<import(".prisma/client").PersonalProject & {
        schedules: (import(".prisma/client").Schedule & {
            comments: import(".prisma/client").Comment[];
        })[];
    }>;
    getPersonalProjects(): Promise<import(".prisma/client").PersonalProject[]>;
    updatePersonalProject(id: any, updatedPersonalProject: any): Promise<import(".prisma/client").PersonalProject>;
}
