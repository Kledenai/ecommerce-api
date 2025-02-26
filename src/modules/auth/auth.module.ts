import { JwtModule } from '@nestjs/jwt';
import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from 'modules/user/user.module';
import { AuthService } from 'modules/auth/auth.service';
import { JwtStrategy } from 'modules/auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from 'modules/auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback_secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
