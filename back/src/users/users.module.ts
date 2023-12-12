import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  providers: [PrismaModule, UserService],
  exports: [UserService],
})
export class UsersModule {}
