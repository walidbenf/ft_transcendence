import { Module } from '@nestjs/common';
import { PrivateMessageController } from './privateMessage.controller';
import { PrivateMessageService } from './privateMessage.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RelationModule } from 'src/relation/relation.module';

@Module({
	imports: [PrismaModule, RelationModule],
  	providers: [PrismaModule, PrivateMessageService, RelationModule],
	controllers: [PrivateMessageController],
  	exports: [PrivateMessageService],
})
export class PrivateMessageModule {}
