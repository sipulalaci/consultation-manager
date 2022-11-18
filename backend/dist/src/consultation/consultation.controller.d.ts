import { PrismaService } from 'prisma/prisma.service';
export declare class ConsultationController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createConsultation(newConsultation: any): Promise<import(".prisma/client").Consultation>;
    getConsultation(id: string): Promise<import(".prisma/client").Consultation>;
    getConsultations(): Promise<import(".prisma/client").Consultation[]>;
    updateConsultation(id: any, updatedConsultation: any): Promise<import(".prisma/client").Consultation>;
}
