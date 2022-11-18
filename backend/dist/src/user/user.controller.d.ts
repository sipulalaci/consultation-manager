import { PrismaService } from '../../prisma/prisma.service';
export declare class UserController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(newUser: any): Promise<import(".prisma/client").User>;
    getUser(id: string): Promise<import(".prisma/client").User>;
    updateUser(id: any, updatedUser: any): Promise<import(".prisma/client").User>;
}
