import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [PrismaModule],
  	providers: [PrismaModule, ChannelService],
	controllers: [ChannelController],
  	exports: [ChannelService],
})
export class ChannelModule {}
