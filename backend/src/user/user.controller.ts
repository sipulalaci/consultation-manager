import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonalProjectStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Protected } from '../auth/jwt.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Protected()
  @Get('me')
  async getMe(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    const { sub } = await this.jwtService.verifyAsync(token);
    const user = await this.prisma.user.findUnique({
      where: { id: sub },
      include: {
        personalProjects: {
          where: {
            OR: [
              { status: PersonalProjectStatus.PENDING },
              { status: PersonalProjectStatus.APPROVED },
            ],
          },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...rest } = user;
    return rest;
  }

  @Post()
  async createUser(@Body() newUser: any) {
    const user = await this.prisma.user.create({ data: newUser });
    return user;
  }

  @Protected()
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  @Protected()
  @Put(':id')
  async updateUser(@Param('id') id: any, @Body() updatedUser: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updatedUser,
    });

    return user;
  }
}
