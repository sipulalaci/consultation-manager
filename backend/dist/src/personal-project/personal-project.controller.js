"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalProjectController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PersonalProjectController = class PersonalProjectController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPersonalProject(newPersonalProject) {
        console.log('newPersonalProject', newPersonalProject);
        const personalProject = await this.prisma.personalProject.create({
            data: Object.assign(Object.assign({}, newPersonalProject), { status: 'PENDING' }),
        });
        return personalProject;
    }
    async getPersonalProject(id) {
        const personalProject = await this.prisma.personalProject.findUnique({
            where: { id },
            include: {
                schedules: {
                    include: {
                        comments: true,
                    },
                },
            },
        });
        return personalProject;
    }
    async getPersonalProjects() {
        return this.prisma.personalProject.findMany();
    }
    async updatePersonalProject(id, updatedPersonalProject) {
        const personalProject = await this.prisma.personalProject.update({
            where: { id },
            data: updatedPersonalProject,
        });
        return personalProject;
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonalProjectController.prototype, "createPersonalProject", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonalProjectController.prototype, "getPersonalProject", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PersonalProjectController.prototype, "getPersonalProjects", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PersonalProjectController.prototype, "updatePersonalProject", null);
PersonalProjectController = __decorate([
    (0, common_1.Controller)('personal-projects'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PersonalProjectController);
exports.PersonalProjectController = PersonalProjectController;
//# sourceMappingURL=personal-project.controller.js.map