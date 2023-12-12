import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrivateMessage } from './interfaces/privateMessage.interface';
import { RelationService } from 'src/relation/relation.service';

@Injectable()
export class PrivateMessageService
{
    private privateMessage: PrivateMessage[] = [];

    constructor(private prisma: PrismaService, private relation: RelationService)
    {
        this.initializeValue();
    }

    private async initializeValue()
    {
        const privateMessagePrisma = await this.prisma.privateMessage.findMany();

        for (let i = 0; i < privateMessagePrisma.length; i++)
        {
            if (!this.privateMessage.find((privateMessage) => privateMessage.userId1 == privateMessagePrisma[i].userId1 && 
                privateMessage.userId2 == privateMessagePrisma[i].userId2 &&
                privateMessage.date == privateMessagePrisma[i].date))
            {
                const privateMessageFromPrisma: PrivateMessage = {
                    userId1: privateMessagePrisma[i].userId1,
                    userId2: privateMessagePrisma[i].userId2,
                    date: privateMessagePrisma[i].date,
                    content: privateMessagePrisma[i].content,
                };
                this.privateMessage.push(privateMessageFromPrisma);
            }
        }
    }

    getAllUserWithPrivateMessage(userId: number): number[]
    {
        const allMyPrivateMessage: PrivateMessage[] = this.privateMessage.filter((privateMessage) =>
            privateMessage.userId1 == Number(userId) ||
            privateMessage.userId2 == Number(userId));

        const allUserWithPrivateMessage: number[] = [];

        for (let i = 0; i < allMyPrivateMessage.length; i++)
        {
            if (allMyPrivateMessage[i].userId1 != Number(userId))
            {
                if (!allUserWithPrivateMessage.find((user) => user == allMyPrivateMessage[i].userId1))
                    allUserWithPrivateMessage.push(allMyPrivateMessage[i].userId1);
            }
            else
            {
                if (!allUserWithPrivateMessage.find((user) => user == allMyPrivateMessage[i].userId2))
                    allUserWithPrivateMessage.push(allMyPrivateMessage[i].userId2);
            }
        }

        return allUserWithPrivateMessage;
    }

    getAllMessageFromUser(userId: number, OtherUserId): PrivateMessage[]
    {
        if (userId == OtherUserId)
            return [];

        const allMyPrivateMessage: PrivateMessage[] = this.privateMessage.filter((privateMessage) =>
            privateMessage.userId1 == Number(userId) || privateMessage.userId2 == Number(userId));
        
        const allMessageFromUser:  PrivateMessage[] = allMyPrivateMessage.filter((privateMessage) =>
            privateMessage.userId1 == Number(OtherUserId) || privateMessage.userId2 == Number(OtherUserId))

        return allMessageFromUser;
    }
    
    async newMessageToUser(userId: number, OtherUserId: number, content: string): Promise<boolean>
    {
        const user1 = await this.prisma.user.findUnique({where: { id: Number(userId) },});
        const user2 = await this.prisma.user.findUnique({where: { id: Number(OtherUserId) },});

        const blocked1 = this.relation.findIfuserBlocked(userId, OtherUserId);
        const blocked2 = this.relation.findIfuserBlocked(OtherUserId, userId);

        if (!user1 || !user2 || blocked1 || blocked2 || userId == OtherUserId)
            return false;

        const privateMessageCreated = await this.prisma.privateMessage.create(
        {
            data:
            {
                userId1: Number(userId),
                userId2: Number(OtherUserId),
                content: content,
            },
        });

        if (!privateMessageCreated)
            return false;

        const newPrivateMessage: PrivateMessage = {
            userId1: privateMessageCreated.userId1,
            userId2: privateMessageCreated.userId2,
            date: privateMessageCreated.date,
            content: privateMessageCreated.content,
        };
        this.privateMessage.push(newPrivateMessage);

        return true;
    }
    
    async updateMessageToUser(userId: number, OtherUserId: number, dateToUpdate: string, content: string): Promise<boolean>
    {
        const user1 = await this.prisma.user.findUnique({where: { id: Number(userId) },});
        const user2 = await this.prisma.user.findUnique({where: { id: Number(OtherUserId) },});
        const privateMessageToUpdate = this.privateMessage.find((privateMessage) =>
            privateMessage.userId1 == Number(userId) &&
            privateMessage.userId2 == Number(OtherUserId) &&
            privateMessage.date.toISOString() == dateToUpdate);

        if (!user1 || !user2 || !privateMessageToUpdate)
            return false;

        const privateMessageUpdated = await this.prisma.privateMessage.update(
        {
            where:
            {
                userId1_userId2_date:
                {
                    userId1: Number(userId),
                    userId2: Number(OtherUserId),
                    date: dateToUpdate,
                },
            },
            data:
            {
                content: content,
            },
        });

        if (!privateMessageUpdated)
            return false;

        privateMessageToUpdate.content = content;

        return true;
    }
    
    async deleteMessageToUser(userId:number, OtherUserId:number, dateToDelete: string): Promise<boolean>
    {
        const user1 = await this.prisma.user.findUnique({where: { id: Number(userId) },});
        const user2 = await this.prisma.user.findUnique({where: { id: Number(OtherUserId) },});
        const privateMessageToDelete = this.privateMessage.find((privateMessage) =>
            privateMessage.userId1 == Number(userId) &&
            privateMessage.userId2 == Number(OtherUserId) &&
            privateMessage.date.toISOString() == dateToDelete);

        if (!user1 || !user2 || !privateMessageToDelete)
            return false;

        const privateMessageDeleted = await this.prisma.privateMessage.delete(
        {
            where:
            {
                userId1_userId2_date:
                {
                    userId1: Number(userId),
                    userId2: Number(OtherUserId),
                    date: dateToDelete,
                },
            },
        });

        if (!privateMessageDeleted)
            return false;

        const index = this.privateMessage.indexOf(privateMessageToDelete);
        delete this.privateMessage[index];
        this.privateMessage.splice(index, 1);

        return true;
    }
}
