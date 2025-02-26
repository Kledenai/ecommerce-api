import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return null;
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    try {
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
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
