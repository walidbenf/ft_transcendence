import { Controller, Get, Post, Body, Put, HttpCode, HttpStatus, Param, UseGuards} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from '../users/users.service';

//import { }

@Controller('api')
export class ApiController {
	constructor(
		private readonly userService: UserService,
	) {}

	@Get()
	getReqform(): string {
		return ("To send an API req: curl -X POST http://localhost:2000/auth/login -d '{\"username\": \"john\", \"password\": \"changeme\"}' -H \"Content-Type: application/json\"");
	// curl -X POST http://localhost:2000/auth/login -d '{"username": "john", "password": "changemel"}' -H "Content-Type: application/json"
}

// ============== USERS
// Rappel
// model User {
// 	id		Int     @default(autoincrement()) @id
// 	email		String  @unique
// 	password  String?
// 	admin		Int		@default(0)
//   }

	@Get('user/id/:id')
	async findUserbyID(@Param('id') id:string): Promise<UserModel>{
		console.log("[api controller user/:id]Returning user by id ", id);
		return this.userService.user({id : Number(id)})
	}

	@Get('user/id')
	async findUserbyIDr(@Body() userData: {id: number}): Promise<UserModel>{
		console.log("[api controller user/id req]Returning user requested as ", userData);
		return this.userService.user(userData)
	}

	@Get('user/mail/:mail')
	async findUserbyMail(@Param('mail') mail:string): Promise<UserModel>{
		console.log("[api controller user/:mail]Returning user by mail ", mail);
		return this.userService.user({email : String(mail)})
	}

	@Get('user/mail')
	async findUserbyMailr(@Body() userData: {email: string}): Promise<UserModel>{
		console.log("[api controller user/mail req]Returning user requested as ", userData);
		return this.userService.user(userData)
	}

	@Get('user')
	async findUserr(@Body() userData): Promise<UserModel>{
		console.log("[api controller user req]Returning user requested as ", userData);
		return this.userService.user(userData)
	}

	@Get('users')
	async findUsers(): Promise<UserModel[]> {
		return this.userService.users({
			orderBy: {id: 'desc'}
		});
	}

	@Get('users/:searchstring')
	async SearchUsers(@Param('searchstring') searchstring: string): Promise<UserModel[]> {
		return this.userService.users({
			where: {
				OR: [
					{
						email: {contains: searchstring}
					},
					{
						name: {contains: searchstring}
					}
				]
			}
		});
	}



	@Get('admins')
	async findAdmins(): Promise<UserModel[]> {
		return this.userService.users({
			where: {admin: 1}
		});
	}
  

	// @Get('user/:data')
	// async findUser(@Param('data') data): Promise<UserModel | string>{
	// 	console.log("[api controller user]Returning user requested as ", data);
	// 	try {
	// 		if (this.userService.user({email: String(data)}) != this.userService.user({id: -1}))
	// 			return this.userService.user({email: String(data)})
	// 	}
	// 	catch {
	// 		console.log("[api controller user] Didn't find it in emails")
	// 	}
	// 	console.log("========================")
	// 	try {
	// 		if (this.userService.user({id: Number(data)}) != null)
	// 			return this.userService.user({id: Number(data)})
	// 	}
	// 	catch {
	// 		console.log("[api controller user] Didn't find it in Ids")
	// 	}
	// 	return ("User was not found, go fuck urself")
	// }

	//@HttpCode(HttpStatus.OK)
	@Post('user')
	async newUser(
	  @Body() userData: { name?: string; email: string },
	): Promise<UserModel> {
	  console.log("New user sign up");
	  return this.userService.createUser(userData);
	}
//
	@Put('chusername')
	async modifyUserName(
		@Body() userdata: {email: string; newname?:string},):
		Promise<UserModel> {
			console.log("[Put user] modifying user request: ", userdata);
			return this.userService.updateUser({
				where: {email: userdata.email},
				data: {name: userdata.newname}
				})
		}

	@Put('chpassword')
	async modifypassword(
		@Body() userdata: {id: string | number, newpass?:string, newsalt?:string}):
		Promise<UserModel | null> {
			console.log("[Put user] modifying user request: ", userdata);
			const OurUser = await this.userService.fuser(userdata.id)
			if (OurUser != null)
			{
				console.log("[put user] User found ", OurUser.id)
				await this.userService.updatePass({
					where: {id: OurUser.id},
					data: {salted_password: userdata.newpass, salt: userdata.newsalt}
				})
				// return this.userService.updateUser({
				// 	where: {email: userdata.email},
				// 	data: {secure: {salted_password: userdata.newpass}}
				// })
				return(OurUser);
			}
			console.log("[put user] user not found")
			return (null);
			// ok
		}

	@Put('chemail')
	async modifyemail(
		@Body() userdata: {email: string; newmail?:string},):
		Promise<UserModel> {
			console.log("[Put user] modifying user request: ", userdata);
			return this.userService.updateUser({
				where: {email: userdata.email},
				data: {name: userdata.newmail}
			})
		}

	@Put('makeadmin')
	async makeadmin(
		@Body() userdata: {email: string; newpass?:string},):
		Promise<UserModel> {
			console.log("[Put user] modifying user request: ", userdata);
			return this.userService.updateUser({
				where: {email: userdata.email},
				data: {name: userdata.newpass}
			})
		}

	@Get('logged')
	async amIlogged(): Promise<any> {
		return "yes !";
	}
	//Modify user
	//Delete user

/*
curl --request POST \
  --url http://localhost:2000/api/newuser \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "bill@gmfail.com",
	"password": "betty"
}'
*/

	// @Post('updateuser')
	// async updateUser(
	// 	@Body() userData: {}
	// )




}
