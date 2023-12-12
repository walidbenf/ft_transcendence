import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Pass, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
	// console.log("[user service user] Found ", this.prisma.user.findUnique({
	// 	where: userWhereUniqueInput,
	//   }));
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
  //$2a$10$YDxX2r/bNkuIoPstmlIqLu7xFzg7BwaO7eFHLOCJXDnvpQBPN.cbK

// salted p: $2a$10$iTyQQuE65WIjoPUOiy8hdukklCwU1uq2XrcNBN58ANOAmuTzHlYCi
// salt:     $2a$10$iTyQQuE65WIjoPUOiy8hdu
  async fuser(input: string | number): Promise<User | null> {
	if (typeof input == "number")
		return await this.user({id: input})
	else
		return await this.user({email: input})
  }

  async pass(
    passWhereUniqueInput: Prisma.PassWhereUniqueInput,
  ): Promise<Pass | null> {
	console.log("[user service pass] Found ", this.prisma.pass.findUnique({
		where: passWhereUniqueInput,
	  }));
    return this.prisma.pass.findUnique({
      where: passWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
	console.log('User created : ', data);
	// data.password = {
	// 	connectOrCreate: {
	// 		id
	// 	}
	// }
    const OurUser = await this.prisma.user.create({
      data,
    });
	// const OurUser = await this.prisma.user.update({
	// 	data,
	// 	where: {
	// 		id: OurUser.id
	// 	}
	// })
	console.log("Our user's id is ", OurUser.id)
	//const OurPassInput = Prisma.PassCreateInput;
	//console.log("Trying stuff")
	//console.log(" ", data: {"bingus": "hi"})
	//console.log("done trying stuff")
	// this.createPass({
	// 	user: {
	// 		connectOrCreate: {
	// 			where: {id: OurUser.id},
	// 			create: {id: OurUser.id}
	// 		},
	// 	}
	// })
	if (this.user(OurUser) == null)
		this.createPassForUser(null, OurUser.id);
	return OurUser;
  }


  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
//  Prisma.UserCreateNestedOneWithoutPasswordInput 
  async createPass(data: Prisma.PassCreateInput): Promise<Pass> {
	console.log('Pass created : ', data);
    return this.prisma.pass.create({data});
  }

  async createPassForUser(data: Prisma.PassCreateInput, id: number): Promise<Pass> {
	console.log('Pass4U created : ', data);
	console.log("with ", {data: {
		user: {
			connect: {
				id: id
			}
		}
	}});
    return this.prisma.pass.create({
		data: {
			user: {
				connect: {
					id: id
				}
			}
		}
	});
  }

  async updatePass(params: {
    where: Prisma.PassWhereUniqueInput;
    data: Prisma.PassUpdateInput;
  }): Promise<Pass> {
    const { where, data } = params;
    return this.prisma.pass.update({
      data,
      where,
    });
  }

  async deletePass(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async userId(where: Prisma.UserWhereUniqueInput): Promise<Number> {
	return this.user(where)['id'];
  }

  async passId(where: Prisma.PassWhereUniqueInput): Promise<Number> {
	return this.prisma.pass.findUnique({where})['id'];
  }

  async IdGetPass(id: Number): Promise<Pass | null> {
	return this.pass({id: Number(id)})
  }

  async checkuserpass(pass: String, id: Number): Promise<Boolean> {
	if ((await this.IdGetPass(id)).salted_password == pass)
	{
		return true;
	}
	return false;
	console.log("gottem");
  }
}