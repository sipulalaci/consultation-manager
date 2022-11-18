import { PrismaService } from 'prisma/prisma.service';
export declare class CommentController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createComment(newComment: any): Promise<import(".prisma/client").Comment>;
    updateComment(id: any, updatedComment: any): Promise<import(".prisma/client").Comment>;
}
