import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Test User',
        status: 'active',
      };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await authService.validateUser('test@example.com', 'password');

      expect(result).toBeDefined();
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        status: 'active',
      });
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null as any);

      const result = await authService.validateUser('nonexistent@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Test User',
        status: 'active',
      };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      const result = await authService.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        status: 'active',
      };

      const result = await authService.login(mockUser);

      expect(result).toEqual({
        access_token: 'mocked_token',
        user: mockUser,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: mockUser.email, sub: mockUser.id });
    });
  });
});
