import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { ChannelModule } from './channel/channel.module';
import { RelationModule } from './relation/relation.module';
import { PrivateMessageModule } from './privateMessage/privateMessage.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot({ignoreEnvFile: true,}), ApiModule, PrismaModule, GameModule, MatchmakingModule, ChannelModule, RelationModule, PrivateMessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
