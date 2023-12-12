import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [PrismaModule],
  	providers: [PrismaModule, GameService],
	controllers: [GameController],
  	exports: [GameService],
})
export class GameModule {}
