import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createUser(@Body() newUser: any) {
    console.log('newUser', newUser);
    const user = await this.prisma.user.create({ data: newUser });
    return user;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  @Put(':id')
  async updateUser(@Param('id') id: any, @Body() updatedUser: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updatedUser,
    });

    return user;
  }
}
