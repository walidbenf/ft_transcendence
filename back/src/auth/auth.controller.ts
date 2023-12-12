import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserValid } from './UserValid.guard';
import { JwtAuthGuard } from './jwt.guard';
import { Public } from './JWTconstant';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  auth(): string {
	return ("Log in u stupid bastard (curl -X POST http://localhost:2000/auth/login -d '{\"username\": \"john\", \"password\": \"changeme\"}' -H \"Content-Type: application/json\")");
  }

  @UseGuards(JwtAuthGuard)
  @Get('loggedstatus')
  async	amIlogged(@Body() user: {email: string, password: string}): Promise<any> {
	console.log("[auth controller amIlogged] Function called")
	return("You are logged, buddy !!!!");
  }

  @Public()
  @UseGuards(UserValid)
  @Post('login')
  async signIn(@Body() user: {email: string, password: string}): Promise<any> {
	console.log("[auth controller login] Function called with ", user)
    return this.authService.signIn(user.email);
  }
}