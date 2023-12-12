import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Blocked } from './interfaces/blocked.interface';
import { Friend } from './interfaces/friend.interface';

@Injectable()
export class RelationService
{
    private blocked: Blocked[] = [];
    private friend: Friend[] = [];

    constructor(private prisma: PrismaService)
    {
        this.initializeValue();
    }

    private async initializeValue()
    {
        const blockedPrisma = await this.prisma.blocked.findMany();
        const friendPrisma = await this.prisma.friend.findMany();

        for (let i = 0; i < blockedPrisma.length; i++)
        {
            if (!this.blocked.find((blocked) => blocked.userId1 == blockedPrisma[i].userId1 && 
                blocked.userId2 == blockedPrisma[i].userId2))
            {
                const blockedFromPrisma: Blocked = {
                    userId1: blockedPrisma[i].userId1,
                    userId2: blockedPrisma[i].userId2,
                };
                this.blocked.push(blockedFromPrisma);
            }
        }

        for (let i = 0; i < friendPrisma.length; i++)
        {
            if (!this.friend.find((friend) => friend.userId1 == friendPrisma[i].userId1 && 
                friend.userId2 == friendPrisma[i].userId2))
            {
                const friendFromPrisma: Friend = {
                    userId1: friendPrisma[i].userId1,
                    userId2: friendPrisma[i].userId2,
                    accepted: friendPrisma[i].accepted,
                };
                this.friend.push(friendFromPrisma);
            }
        }
    }

    // return all blocked user from an User Id
    findMyBlocked(userId: number): Blocked[]
    {
        return this.blocked.filter((blocked) => blocked.userId1 == Number(userId));
    }

    // return a blocked Object (is the relation userId && userIdIsBlock exist in blocked) or undefined
    findIfuserBlocked(userId: number, userIdIsBlock: number): Blocked | undefined
    {
        const myBlocked: Blocked[] = this.findMyBlocked(userId);
        return myBlocked.find((blocked) => blocked.userId2 == Number(userIdIsBlock))
    }


    // will block someone if user exists and not already blocked
    async blockSomeone(userId: number, userIdToBlock: number): Promise<boolean>
    {
        if (userId == userIdToBlock)
            return false;

        const user = await this.prisma.user.findFirst({where : {id: Number(userId),}});
        const userToBlock = await this.prisma.user.findFirst({where : {id: Number(userIdToBlock),}});
        if (!user || !userToBlock)
            return false;

        const myTargetBlocked: Blocked = this.findIfuserBlocked(userId, userIdToBlock);
        if (myTargetBlocked)
            return false;

        const BlockedCreated = await this.prisma.blocked.create(
        {
            data:
            {
                userId1: Number(userId),
                userId2: Number(userIdToBlock),
            },
        });

        if (!BlockedCreated)
            return false;
        
        const blockedFromPrisma: Blocked = {
            userId1: BlockedCreated.userId1,
            userId2: BlockedCreated.userId2,
        };
        this.blocked.push(blockedFromPrisma);

        return true;
    }


    // will block someone if user exists and not already blocked
    async unBlockSomeone(userId: number, userIdToUnBlock: number): Promise<boolean>
    {
        const user = await this.prisma.user.findFirst({where : {id: Number(userId),}});
        const userToUnBlock = await this.prisma.user.findFirst({where : {id: Number(userIdToUnBlock),}});
        if (!user || !userToUnBlock)
            return false;

        const myTargetBlocked: Blocked = this.findIfuserBlocked(userId, userIdToUnBlock);
        if (!myTargetBlocked)
            return false;

        await this.prisma.blocked.delete(
        {
            where:
            {
                userId1_userId2:
                {
                    userId1: Number(userId),
                    userId2: Number(userIdToUnBlock),
                },
            },
        });
        
        const index = this.blocked.indexOf(myTargetBlocked)
        delete this.blocked[index];
        this.blocked.splice(index, 1);

        return true;
    }

    // return all frien from an User Id (nor pending or emmited request) (accepted = true)
    findMyFriend(userId: number): Friend[]
    {
        return this.friend.filter((friend) => (friend.userId1 == Number(userId) ||
            friend.userId2 == Number(userId)) && friend.accepted == true);
    }

    // return all friend pending request (userId2 = userId && accepted = false)
    findMyPendingRequests(userId: number): Friend[]
    {
        return this.friend.filter((friend) => friend.userId2 == Number(userId) && friend.accepted == false);
    }

    // return all friend emmited request (userId1 = userId && accepted = false)
    findMyEmmitedRequest(userId: number): Friend[]
    {
        return this.friend.filter((friend) => friend.userId1 == Number(userId) && friend.accepted == false);
    }

    // return a friend Object (is the relation userId && userIdIsBlock exist in friend) or undefined
    private findIfuserIsFriend(userId: number, userIdIsFriend: number): Friend | undefined
    {
        const myFriend: Friend[] = this.findMyFriend(userId);
        return myFriend.find((friend) => friend.userId1 == Number(userIdIsFriend) || 
            friend.userId2 == Number(userIdIsFriend))
    }

    // return a friend Object (is the relation userId && userIdIsBlock exist in friend and in pending states) or undefined
    private findIfuserIsFriendPendingRequest(userId: number, userIdIsFriendPending: number): Friend | undefined
    {
        const myFriendPendingRequest: Friend[] = this.findMyPendingRequests(userId);
        return myFriendPendingRequest.find((friend) => friend.userId1 == Number(userIdIsFriendPending))
    }

    // return a friend Object (is the relation userId && userIdIsBlock exist in friend and in emmited states) or undefined
    private findIfuserIsFriendEmmitedRequest(userId: number, userIdIsFriendEmmited: number): Friend | undefined
    {
        const myFriendEmmitedRequest: Friend[] = this.findMyEmmitedRequest(userId);
        return myFriendEmmitedRequest.find((friend) => friend.userId2 == Number(userIdIsFriendEmmited))
    }

    // 2 call, emmit request and accept request
    async addFriend(userId: number, userIdRequest: number): Promise<boolean>
    {
        if (userId == userIdRequest)
        return false;
    
        const user = await this.prisma.user.findFirst({where : {id: Number(userId),}});
        const userToBlock = await this.prisma.user.findFirst({where : {id: Number(userIdRequest),}});
        if (!user || !userToBlock)
            return false;

        if (this.findIfuserBlocked(userId, userIdRequest) || this.findIfuserBlocked(userIdRequest, userId))
            return false;

        const UserIdMyFriend: Friend = this.findIfuserIsFriend(userId, userIdRequest);
        const UserIdMyFriendPendingRequest: Friend = this.findIfuserIsFriendPendingRequest(userId, userIdRequest);
        const UserIdMymyFriendEmmitedRequest: Friend = this.findIfuserIsFriendEmmitedRequest(userId, userIdRequest);

        if (UserIdMyFriend || UserIdMymyFriendEmmitedRequest)
            return false;

        if (UserIdMyFriendPendingRequest)
        {
            const friendUpdated = await this.prisma.friend.update(
            {
                where: {
                    userId1_userId2:
                    {
                        userId1: Number(userIdRequest),
                        userId2: Number(userId),
                    },
                },
                data: {
                    accepted: Boolean(true),
                },
            });

            if (!friendUpdated)
                return false;

            UserIdMyFriendPendingRequest.accepted = friendUpdated.accepted;
        }
        else
        {
            const FriendRequestCreated = await this.prisma.friend.create(
            {
                data:
                {
                    userId1: Number(userId),
                    userId2: Number(userIdRequest),
                },
            });

            if (!FriendRequestCreated)
                return false;
            
            const FriendRequestCreatedFromPrisma: Friend = {
                userId1: FriendRequestCreated.userId1,
                userId2: FriendRequestCreated.userId2,
                accepted: FriendRequestCreated.accepted,
            };
            this.friend.push(FriendRequestCreatedFromPrisma);
        }
        return true;
    }

    // 3 call, by remove decline, and cancel
    async removeFriend(userId: number, userIdToRemove: number): Promise<boolean>
    {
        const user = await this.prisma.user.findFirst({where : {id: Number(userId),}});
        const userToBlock = await this.prisma.user.findFirst({where : {id: Number(userIdToRemove),}});
        if (!user || !userToBlock)
            return false;

        const UserIdMyFriend: Friend = this.findIfuserIsFriend(userId, userIdToRemove);
        const UserIdMyFriendPendingRequest: Friend = this.findIfuserIsFriendPendingRequest(userId, userIdToRemove);
        const UserIdMymyFriendEmmitedRequest: Friend = this.findIfuserIsFriendEmmitedRequest(userId, userIdToRemove);

        if (!UserIdMyFriend && !UserIdMyFriendPendingRequest && !UserIdMymyFriendEmmitedRequest)
            return false;
        
        if ((UserIdMyFriend && UserIdMyFriend.userId1 == userId) || UserIdMymyFriendEmmitedRequest)
        {
            const friendRemovedFromPrisma = await this.prisma.friend.delete(
            {
                where:
                {
                    userId1_userId2:
                    {
                        userId1: Number(userId),
                        userId2: Number(userIdToRemove),
                    },
                },
            });

            if (!friendRemovedFromPrisma)
                return false;
        }
        else if ((UserIdMyFriend && UserIdMyFriend.userId2 == userId) || UserIdMyFriendPendingRequest)
        {
            const friendRemovedFromPrisma = await this.prisma.friend.delete(
            {
                where:
                {
                    userId1_userId2:
                    {
                        userId1: Number(userIdToRemove),
                        userId2: Number(userId),
                    },
                },
            });

            if (!friendRemovedFromPrisma)
                return false;
        }

        let index: number;

        if (UserIdMyFriend)
            index = this.friend.indexOf(UserIdMyFriend);
        else if (UserIdMyFriendPendingRequest)
            index = this.friend.indexOf(UserIdMyFriendPendingRequest);
        else
            index = this.friend.indexOf(UserIdMymyFriendEmmitedRequest);

        delete this.friend[index];
        this.friend.splice(index, 1);

        return true;
    }

}
