import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { email: string; password: string; name: string }) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already in use');
      }
      throw error;
    }
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }  

  async updateUser(id: number, data: { email?: string; password?: string; name?: string }) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
