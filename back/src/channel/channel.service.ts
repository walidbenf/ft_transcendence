import { Injectable } from '@nestjs/common';
import { Provider } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Channel } from './interfaces/channel.interface';
import { IsMemberOf } from './interfaces/isMemberOf.interface';
import { ChannelMessage } from './interfaces/channelMessage.interface';
import e from 'express';
import { notEqual } from 'assert';
// import { timer } from 'rxjs';


@Injectable()
export class ChannelService {

    // stored all active game in this variable
    private channel: Channel[] = [];
    private isMemberOf: IsMemberOf[] = [];
    private channelMessage: ChannelMessage[] = [];

    // constructor and call a clock to update all game
    constructor(private prisma: PrismaService)
    {
        this.initializeValue();
    }

    private async initializeValue()
    {
        const channelPrisma = await this.prisma.channel.findMany();
        const isMemberOfPrisma = await this.prisma.isMemberOf.findMany();
        const channelMessagePrisma = await this.prisma.channelMessage.findMany();

        for (let i = 0; i < channelPrisma.length; i++)
        {
            if (!this.channel.find((channel) => channel.id == channelPrisma[i].id))
            {
                const channelFromPrisma: Channel = {
                    id: channelPrisma[i].id,
                    name: channelPrisma[i].name,
                    pathImage: channelPrisma[i].pathImage,
                    privacy: channelPrisma[i].privacy,
                    creation: channelPrisma[i].creation,
                };
                this.channel.push(channelFromPrisma);
            }
        }

        for (let j = 0; j < isMemberOfPrisma.length; j++)
        {
            if (!this.isMemberOf.find((isMemberOf) => isMemberOf.userId == isMemberOfPrisma[j].userId && 
                isMemberOf.channelId == isMemberOfPrisma[j].channelId))
            {
                const isMemberOfFromPrisma: IsMemberOf = {
                    userId: isMemberOfPrisma[j].userId,
                    channelId: isMemberOfPrisma[j].channelId,
                    status: isMemberOfPrisma[j].status,
                    dateJoined: isMemberOfPrisma[j].dateJoined,

                };
                this.isMemberOf.push(isMemberOfFromPrisma);
            }
        }

        for (let k = 0; k < channelMessagePrisma.length; k++)
        {
            if (!this.channelMessage.find((channelMessage) => 
                channelMessage.userId == channelMessagePrisma[k].userId && 
                channelMessage.channelId == channelMessagePrisma[k].channelId && 
                channelMessage.date == channelMessagePrisma[k].date))
            {
                const channelMessageFromPrisma: ChannelMessage = {
                    userId: channelMessagePrisma[k].userId,
                    channelId: channelMessagePrisma[k].channelId,
                    date: channelMessagePrisma[k].date,
                    content: channelMessagePrisma[k].content,

                };
                this.channelMessage.push(channelMessageFromPrisma);
            }
        }
    }

    findAllChannels(): Channel[]
    {
        return this.channel;
    }

    findMyChannels(userId: number): Channel[]
    {
        const myChannels: Channel[] = [];
        const userIsOnChannels = this.isMemberOf.filter((isMemberOf) => isMemberOf.userId == userId);
        
        for (let i = 0; i < this.channel.length; i++)
        {
            for (let j = 0; j < userIsOnChannels.length; j++)
            {
                if (this.channel[i].id == userIsOnChannels[j].channelId && userIsOnChannels[j].status != "BANNED")
                    myChannels.push(this.channel[i]);
            }
        }

        return myChannels;
    }

    async findSpecificChannels(channelId: number, userId: number): Promise<Channel | undefined>
    {    
        const realtion = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId && 
            isMemberOf.channelId == channelId);

        if (realtion && realtion.status != "BANNED")
            return this.channel.find((channel) => channel.id == realtion.channelId);
        else
            return undefined;
    }

    async createChannel(userId: number, channelName: string, channelPrivacy: boolean, 
        channelPass: string): Promise<Channel>
    {
        const user = await this.prisma.user.findFirst(
        {
            where : {id: Number(userId),}
        });

        if (!user)
            return ;

        const channelCreated = await this.prisma.channel.create(
        {
            data:
            {
                name: channelName,
                privacy: channelPrivacy,
                password: channelPass,
                creation: new Date(),
            },
        });

        if (!channelCreated)
            return ;

        const isMemberOfCreated = await this.prisma.isMemberOf.create(
        {
            data:
            {
                userId: Number(userId),
                channelId: channelCreated.id,
                status: "OWNER",
                dateJoined: channelCreated.creation,
            },
        });

        if (!isMemberOfCreated)
            return ;
        
        const newChannel: Channel = {
            id: channelCreated.id,
            name: channelCreated.name,
            pathImage: channelCreated.pathImage,
            privacy: channelCreated.privacy,
            creation: channelCreated.creation,
        };

        const newIsMemberOf: IsMemberOf = {
            userId: isMemberOfCreated.userId,
            channelId: isMemberOfCreated.channelId,
            status: isMemberOfCreated.status,
            dateJoined: isMemberOfCreated.dateJoined,
        };

        this.channel.push(newChannel); 
        this.isMemberOf.push(newIsMemberOf);
        return newChannel;
    }

    async updateChannelName(channelId:number, userId: number, newName: string): Promise<boolean>
    {
        const relation : IsMemberOf = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        if (relation && (relation.status == "OWNER" || relation.status == "ADMIN"))
        {
            const channel = this.channel.find((channel) => channel.id == channelId);
            if (channel)
            {
                const channelUpdated = await this.prisma.channel.update(
                {
                    where: { id: Number(channelId) },
                    data: { name: newName },
                });

                if (!channelUpdated)
                    return false;

                channel.name = channelUpdated.name;
                return true;
            }
        }
        return false;
    }

    async updateChannelImage(channelId:number, userId: number, newPathImage: string): Promise<boolean>
    {
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        if (relation && (relation.status == "OWNER" || relation.status == "ADMIN"))
        {
            const channel = this.channel.find((channel) => channel.id == channelId);
            if (channel)
            {
                const channelUpdated = await this.prisma.channel.update(
                {
                    where: { id: Number(channelId) },
                    data: { pathImage: newPathImage },
                });

                if (!channelUpdated)
                    return false;

                channel.pathImage = channelUpdated.pathImage;
                return true;
            }
        }
        return false;
    }

    async updateChannelPrivacy(channelId:number, userId: number, newPrivacy: boolean): Promise<boolean>
    {
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        if (relation && (relation.status == "OWNER" || relation.status == "ADMIN"))
        {
            const channel = this.channel.find((channel) => channel.id == channelId);
            if (channel)
            {
                const channelUpdated = await this.prisma.channel.update(
                {
                    where: { id: Number(channelId) },
                    data: { privacy: Boolean(newPrivacy) },
                });

                if (!channelUpdated)
                    return false;

                channel.privacy = channelUpdated.privacy;
                return true;
            }
        }
        return false;
    }

    async updateChannelPassword(channelId:number, userId: number, newPassword: string): Promise<boolean>
    {
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        if (relation && (relation.status == "OWNER" || relation.status == "ADMIN"))
        {
            const channel = this.channel.find((channel) => channel.id == channelId);
            if (channel)
            {
                const channelUpdated = await this.prisma.channel.update(
                {
                    where: { id: Number(channelId) },
                    data: { password: newPassword },
                });

                if (!channelUpdated)
                    return false;

                return true;
            }
        }
        return false;
    }

    async deleteChannel(channelId:number, userId: number): Promise<boolean>
    {
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        if (relation && (relation.status == "OWNER"))
        {
            const channelToDelete = this.channel.find((channel) => channel.id == channelId);
            if (channelToDelete)
            {
                const isMemberOfDeleted = await this.prisma.isMemberOf.deleteMany(
                {
                    where: { channelId: Number(channelId) },
                });

                if (!isMemberOfDeleted)
                    return false;

                for (let i = 0; i < this.isMemberOf.length; i++)
                {
                    if (this.isMemberOf[i].channelId == channelId)
                    {
                        delete this.isMemberOf[i];
                        this.isMemberOf.splice(i, 1);
                        i--;
                    }
                }

                const channelDeleted = await this.prisma.channel.delete(
                {
                    where: { id: Number(channelId) },
                });

                if (!channelDeleted)
                    return false;
                
                const index = this.channel.indexOf(channelToDelete)
                delete this.channel[index];
                this.channel.splice(index, 1);
                return true;
            }
        } 
        return false;
    }

    async getUsersOfChannel(channelId:number, userId: number): Promise<IsMemberOf[]>
    {
        if (this.isMemberOf.find((isMemberOf) => isMemberOf.channelId == Number(channelId) &&
            isMemberOf.userId == Number(userId)))
            return this.isMemberOf.filter((isMemberOf) => isMemberOf.channelId == Number(channelId));
        return [];
    }

    async joinChannel(channelId:number, userId: number, password: string): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const chPrisma = await this.prisma.channel.findUnique({where: {id: Number(channelId)}});
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);

        if (!ch || !chPrisma ||
            (relation && relation.status != "INVITED") ||
            (ch.privacy == true && !relation) ||
            (ch.privacy == true && relation && relation.status != "INVITED"))
            return false;
        

        if (relation && relation.status == "INVITED")
        {
            const isMemberOfUpdated = await this.prisma.isMemberOf.updateMany(
            {
                where: {
                    userId: Number(userId),
                    channelId: Number(channelId),
                },
                data: { status: "MEMBER" } 
            });

            if (!isMemberOfUpdated)
                return false;

            relation.status = "MEMBER";

            return true;
        }   
        else if (chPrisma.password == "" || chPrisma.password == password)
        {
            const isMemberOfCreated = await this.prisma.isMemberOf.create(
            {
                data: {
                    userId: Number(userId),
                    channelId: Number(channelId),
                    status: "MEMBER",
                },
            });

            if (!isMemberOfCreated)
                return false;
    
            const newIsMemberOf: IsMemberOf = {
                userId: isMemberOfCreated.userId,
                channelId: isMemberOfCreated.channelId,
                status: isMemberOfCreated.status,
                dateJoined: isMemberOfCreated.dateJoined,
            };

            this.isMemberOf.push(newIsMemberOf);
            return true;
        }
        return false;
    }

    async inviteChannel(channelId:number, userId: number, userIdInvited: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationinvited = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdInvited &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || relationinvited)
            return false;
        

        if (relation.status == "OWNER" || relation.status == "ADMIN")
        {
            const isMemberOfCreated = await this.prisma.isMemberOf.create(
            {
                data:
                {
                    userId: Number(userIdInvited),
                    channelId: Number(channelId),
                    status: "INVITED",
                },
            });

            if (!isMemberOfCreated)
                return false;
    
            const newIsMemberOf: IsMemberOf = {
                userId: isMemberOfCreated.userId,
                channelId: isMemberOfCreated.channelId,
                status: isMemberOfCreated.status,
                dateJoined: isMemberOfCreated.dateJoined,
            };

            this.isMemberOf.push(newIsMemberOf);
            return true;
        }

        return false;
    }

    async banFromChannel(channelId:number, userId: number, userIdToBan: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToBan = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToBan &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || (relationToBan && (relationToBan.status == "OWNER" ||
            relationToBan.status == "ADMIN" || relationToBan.status == "BANNED")))
            return false;

        if (relation.status == "OWNER" || relation.status == "ADMIN")
        {
            if (relationToBan)
            {
                const isMemberOfUpdated = await this.prisma.isMemberOf.updateMany(
                {
                    where:
                    {
                        userId: Number(userIdToBan),
                        channelId: Number(channelId),
                    },
                    data: {status: "BANNED"}
                });

                if (!isMemberOfUpdated)
                    return false;

                relationToBan.status = "BANNED";
            }
            else
            {
                const isMemberOfCreated = await this.prisma.isMemberOf.create(
                {
                    data:
                    {
                        userId: Number(userIdToBan),
                        channelId: Number(channelId),
                        status: "BANNED",
                    },
                });
        
                if (!isMemberOfCreated)
                    return false;
                
                const newIsMemberOf: IsMemberOf = {
                    userId: isMemberOfCreated.userId,
                    channelId: isMemberOfCreated.channelId,
                    status: isMemberOfCreated.status,
                    dateJoined: isMemberOfCreated.dateJoined,
                };
    
                this.isMemberOf.push(newIsMemberOf);
            }
            return true;
        }
        return false;
    }

    async unBanFromChannel(channelId:number, userId: number, userIdToUnBan: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToUnBan = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToUnBan &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || !relationToUnBan || (relationToUnBan && relationToUnBan.status != "BANNED"))
            return false;

        if (relation.status == "OWNER" || relation.status == "ADMIN")
        {
            const isMemberOfDeleted = await this.prisma.isMemberOf.deleteMany(
            {
                where:
                {
                    channelId: Number(channelId),
                    userId: Number(userIdToUnBan),
                },
            });

            if (!isMemberOfDeleted)
                return false;

            const index = this.isMemberOf.indexOf(relationToUnBan)

            delete this.isMemberOf[index];
            this.isMemberOf.splice(index, 1);
            
            return true;
        }
        return false;
    }

    async muteFromChannel(channelId:number, userId: number, userIdToMute: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToMute = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToMute &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || !relationToMute || (relationToMute && relationToMute.status != "MEMBER"))
            return false;

        if (relation.status == "OWNER" || relation.status == "ADMIN")
        {
            const isMemberOfUpdated = await this.prisma.isMemberOf.updateMany(
            {
                where:
                {
                    userId: Number(userIdToMute),
                    channelId: Number(channelId),
                },
                data: {status: "MUTED"}
            });

            if (!isMemberOfUpdated)
                return false;

            relationToMute.status = "MUTED";

            return true;
        }
        return false;
    }

    async unmuteFromChannel(channelId:number, userId: number, userIdToUnMute: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToUnMute = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToUnMute &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || !relationToUnMute || (relationToUnMute && relationToUnMute.status != "MUTED"))
            return false;

        if (relation.status == "OWNER" || relation.status == "ADMIN")
        {
            const isMemberOfUpdated = await this.prisma.isMemberOf.updateMany(
            {
                where:
                {
                    userId: Number(userIdToUnMute),
                    channelId: Number(channelId),
                },
                data: {status: "MEMBER"}
            });

            if (!isMemberOfUpdated)
                return false;

            relationToUnMute.status = "MEMBER";

            return true;
        }
        return false;
    }

    async promoteFromChannel(channelId:number, userId: number, userIdToPromote: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToPromote = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToPromote &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || !relationToPromote || (relationToPromote && relationToPromote.status != "MEMBER"))
            return false;

        if (relation.status == "OWNER")
        {
            const isMemberOfUpdated = await this.prisma.isMemberOf.updateMany(
            {
                where:
                {
                    userId: Number(userIdToPromote),
                    channelId: Number(channelId),
                },
                data: {status: "ADMIN"}
            });

            if (!isMemberOfUpdated)
                return false;

            relationToPromote.status = "ADMIN";

            return true;
        }
        return false;
    }

    async demoteFromChannel(channelId:number, userId: number, userIdToDemote: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToDemote = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToDemote &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || !relationToDemote || (relationToDemote && relationToDemote.status != "ADMIN"))
            return false;

        if (relation.status == "OWNER")
        {
            const isMemberOfUpdated = await this.prisma.isMemberOf.updateMany(
            {
                where:
                {
                    userId: Number(userIdToDemote),
                    channelId: Number(channelId),
                },
                data: {status: "MEMBER"}
            });

            if (!isMemberOfUpdated)
                return false;

            relationToDemote.status = "MEMBER";

            return true;
        }
        return false;
    }

    async giveOwnershipChannelTo(channelId:number, userId: number, userIdToGiveOwnership: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToGiveOwnership = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToGiveOwnership &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || !relationToGiveOwnership || 
            (relationToGiveOwnership && relationToGiveOwnership.status != "ADMIN"))
            return false;

        if (relation.status == "OWNER")
        {
            const IsMemberOfUpdated = await this.prisma.isMemberOf.updateMany(
            {
                where:
                {
                    userId: Number(userIdToGiveOwnership),
                    channelId: Number(channelId),
                },
                data: {status: "OWNER"}
            });

            if (!IsMemberOfUpdated)
                return false;

            relationToGiveOwnership.status = "OWNER";

            const IsMemberOfUpdated2 = await this.prisma.isMemberOf.updateMany(
            {
                where:
                {
                    userId: Number(userId),
                    channelId: Number(channelId),
                },
                data: {status: "ADMIN"}
            });

            if (!IsMemberOfUpdated2)
                return false;

            relation.status = "ADMIN";

            return true;
        }
        return false;
    }

    async KickFromChannel(channelId:number, userId: number, userIdToKick: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);
        const relationToKick = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userIdToKick &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || !relationToKick ||
            relationToKick.status == "OWNER" || relationToKick.status == "BANNED" ||
            (relationToKick.status == "ADMIN" && relation.status != "OWNER"))
            return false;

        if (relation.status == "OWNER" || relation.status == "ADMIN")
        {
            const isMemberOfDeleted = await this.prisma.isMemberOf.deleteMany(
            {
                where: 
                {
                    channelId: Number(channelId),
                    userId: Number(userIdToKick),
                },
            });

            if (!isMemberOfDeleted)
                return false;

            const index = this.isMemberOf.indexOf(relationToKick)
            delete this.isMemberOf[index];
            this.isMemberOf.splice(index, 1);
            return true;
        }
        return false;
    }

    async leaveChannel(channelId:number, userId: number): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch)
            return false;

        if (relation.status != "OWNER" && relation.status != "BANNED")
        {
            const isMemberOdDeleted = await this.prisma.isMemberOf.deleteMany(
            {
                where:
                {
                    channelId: Number(channelId),
                    userId: Number(userId),
                }, 
            });

            if (!isMemberOdDeleted)
                return false;

            const index = this.isMemberOf.indexOf(relation)

            delete this.isMemberOf[index];
            this.isMemberOf.splice(index, 1);
            return true;
        }
        return false;
    }

    async getAllMessageFromChannel(channelId:number, userId: number): Promise<ChannelMessage[]>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || relation.status == "BANNED" || relation.status == "INVITED")
            return ;

        return this.channelMessage.filter((channelMessage) => channelMessage.channelId == channelId);
    }

    async newMessageToChannel(channelId:number, userId: number, content: string): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id = channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || relation.status == "BANNED" ||
            relation.status == "INVITED" || relation.status == "MUTED")
            return false;

        const channelMessageCreated = await this.prisma.channelMessage.create(
            {
            data:
            {
                userId: Number(userId),
                channelId: Number(channelId),
                content: content,
            },
        });

        if (!channelMessageCreated)
            return false;

        const newChanneMessage: ChannelMessage = {
            userId: channelMessageCreated.userId,
            channelId: channelMessageCreated.channelId,
            content: channelMessageCreated.content,
            date: channelMessageCreated.date,
        };
        this.channelMessage.push(newChanneMessage);

        return true;
    }

    async updateMessageToChannel(channelId:number, userId: number, dateMessageToUpdate: string, content: string): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || relation.status == "BANNED" || relation.status == "INVITED" ||
            relation.status == "MUTED")
            return false;

        const message = this.channelMessage.find((channelMessage) => channelMessage.userId == userId &&
            channelMessage.channelId == channelId && channelMessage.date.toISOString() == dateMessageToUpdate);
        
        if (!message)
            return false;

        const channelMessageUpdated = this.prisma.channelMessage.updateMany(
        {
            where:
            {
                userId: Number(userId),
                channelId: Number(channelId),
                date: dateMessageToUpdate,
            },
            data: {content: content}
        });

        if (!channelMessageUpdated)
            return false;

        message.content = content;

        return true;
    }

    async deleteMessageFromChannel(channelId:number, userId: number, userIdMessage: number, dateMessageToDelete: string): Promise<boolean>
    {
        const ch = this.channel.find((channel) => channel.id == channelId);
        const relation = this.isMemberOf.find((isMemberOf) => isMemberOf.userId == userId &&
            isMemberOf.channelId == channelId);

        if (!relation || !ch || relation.status == "BANNED" || relation.status == "INVITED" ||
            (userId != userIdMessage && relation.status != "OWNER" && relation.status != "ADMIN"))
            return false;

        const message = this.channelMessage.find((channelMessage) => channelMessage.userId == userIdMessage &&
            channelMessage.channelId == channelId && channelMessage.date.toISOString() == dateMessageToDelete);
        
        if (!message)
            return false;

        const channelMessageDeleted = await this.prisma.channelMessage.deleteMany(
        {
            where:
            {
                channelId: Number(channelId),
                userId: Number(userIdMessage),
                date: dateMessageToDelete,
            },
        });

        if (!channelMessageDeleted)
            return false;

        const index = this.channelMessage.indexOf(message)
        delete this.channelMessage[index];
        this.channelMessage.splice(index, 1);
        return true;
    }
}
