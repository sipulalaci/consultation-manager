import { PrismaService } from 'prisma/prisma.service';
export declare class ProjectController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createProject(newProject: any): Promise<import(".prisma/client").Project>;
    getProject(id: string): Promise<import(".prisma/client").Project>;
    getProjects(): Promise<import(".prisma/client").Project[]>;
    updateProject(id: any, updatedProject: any): Promise<import(".prisma/client").Project>;
    deleteProject(id: any): Promise<import(".prisma/client").Project>;
}
