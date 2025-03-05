import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        status: true,
      },
    });
  
    if (!user) {
      return null;
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  

  async login(user: { id: number; email: string; name: string; status: string }) {
    const payload = { sub: user.id, email: user.email };

    try {
      return {
        token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Error generating JWT token');
    }
  }
}
