import { Module } from '@nestjs/common';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from 'src/game/game.module';

@Module({
	imports: [PrismaModule, GameModule],
  	providers: [PrismaModule, MatchmakingService, GameModule],
	controllers: [MatchmakingController],
  	exports: [MatchmakingService],
})
export class MatchmakingModule {}
