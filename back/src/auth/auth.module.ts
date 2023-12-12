import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './JWTconstant';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersModule, LocalStrategy, JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }
	],
  imports: [UsersModule, PassportModule, JwtModule.register({
	secret: jwtConstant.secret,
	signOptions: { expiresIn: '24h'}
  })],
})
export class AuthModule {}
