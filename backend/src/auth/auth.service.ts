import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonalProjectStatus, User, UserType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
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
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(pass, user.password);

    if (isPasswordCorrect) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>) {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: {
    name: string;
    email: string;
    password: string;
    type: UserType;
    neptun?: string;
    department?: string;
  }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
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
    const payload = { username: newUser.name, sub: newUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
