import { Injectable, UnauthorizedException} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
	private usersService: UserService,
	private jwtService: JwtService
	) {}

  async validUserPW(mail: string, pass: string): Promise<any> {
	console.log("[auth service validUser] function call with mail ", mail, " pass ", pass)
    const myuser =  await this.usersService.user({email: mail});
	const mypass = await this.usersService.IdGetPass(myuser.id);
	const ismatch = await bcrypt.compare(pass, mypass.salted_password);
	//const ismatch = await bcrypt.compare(pass, mypass.salt, null);
	//console.log("[validuserpw] It looks like the password match between ", pass, "and the salt gives ", ismatch);
	//console.log("[validuserpw] It looks like the password match between ", mypass.salted_password, "and the salt gives ", ismatch);
	//console.log("My user is ", myuser)
	if (myuser && ismatch != true) {
//	if (myuser && await this.usersService.checkuserpass(pass, myuser?.id) != true) {
		console.log("Failed to sign in")
		return (null);
	}
	return myuser;
  }
//
  async signIn(user: any): Promise<any> {
    
	console.log("[auth service sign in called with params ", user)
	const OurUser = await this.usersService.fuser(user);
	console.log("[auth service sign in] signin in user ", OurUser);
	if (OurUser)
	{
		console.log("[auth sign in] sign in successful");
		const JWT = { email: OurUser.email, id: OurUser.id};
		return {access_token: this.jwtService.sign(JWT)};
	}
	console.log("[auth sign in] sign in failed")
	return ({content: "Go fuck yourself"});
  }
}

//test
