import { Controller, Get, Post, Body} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './users/users.service';
import { User as UserModel } from '@prisma/client';


@Controller()
export class AppController {
  constructor(
	private readonly appService: AppService,
	private readonly userService: UserService,
	) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('a')
  getBnuuy(): string {
	return this.appService.getBnuuy();
  }
  @Get("b")
  getB(): string {
	return ("b");
  }

}
