import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from '../game/game.service';
import { Matchmaking } from './interfaces/matchmaking.interface';


@Injectable()
export class MatchmakingService
{
    private matchmaking: Matchmaking[] = [];
    private numberMatchmaking: number = 0;

    constructor(private prisma: PrismaService, private game: GameService)
    {
        setInterval(async () =>
        {
            const now = new Date();

            for (let i = 0; i < this.matchmaking.length; i++)
            {
                // console.log("matchmaking Id:",this.matchmaking[i].id);
                if (!this.matchmaking[i].isMatchmakingLinked)
                {
                    for (let j = 0; j < this.matchmaking.length; j++)
                    {
                        if (this.matchmaking[i].isDuel == false &&
                            !this.matchmaking[j].isMatchmakingLinked &&
                            this.matchmaking[i].userId != this.matchmaking[j].userId &&
                            this.matchmaking[i].isRanked == this.matchmaking[j].isRanked)
                        {
                            const elo1 = this.matchmaking[i].userElo;
                            const elo2 = this.matchmaking[j].userElo;
                            const timeWaited1 = (now.getTime() - this.matchmaking[i].date.getTime()) / 1000;
                            const timeWaited2 = (now.getTime() - this.matchmaking[j].date.getTime()) / 1000;
                            if ((elo1 + 10 * timeWaited1 >= elo2 || elo1 + 10 * timeWaited2 <= elo1) && 
                                (elo2 + 10 * timeWaited2 >= elo1 || elo2 + 10 * timeWaited2 <= elo1))
                            {
                                const gameId = await this.createGame(this.matchmaking[i], this.matchmaking[j]);
                                if (gameId != -1)
                                {
                                    this.matchmaking[i].idGameLinked = gameId;
                                    this.matchmaking[j].idGameLinked = gameId;
                                    this.matchmaking[i].isMatchmakingLinked = true;
                                    this.matchmaking[j].isMatchmakingLinked = true;
                                }
                            }
                        }
                    }
                }
                else if (this.matchmaking[i].isDuel == true)
                {
                    const duelLinked = this.matchmaking.find((matchmaking) => matchmaking.id == this.matchmaking[i].idDuelLinked);
                    const indexDuelLinked = this.matchmaking.indexOf(duelLinked);
                    if (this.matchmaking[i].idGameLinked == 0 &&
                        this.matchmaking[i].isDuelAccepted == true &&
                        this.matchmaking[indexDuelLinked] &&
                        this.matchmaking[indexDuelLinked].isDuelAccepted == true)
                    {
                        const gameId = await this.createGame(this.matchmaking[i], this.matchmaking[indexDuelLinked]);
                        if (gameId > 0)
                        {
                            this.matchmaking[i].idGameLinked = gameId;
                            this.matchmaking[indexDuelLinked].idGameLinked = gameId;
                            this.matchmaking[i].isMatchmakingLinked = true;
                            this.matchmaking[indexDuelLinked].isMatchmakingLinked = true;
                        }
                    }
                }
                else
                {
                    const game = await this.game.findById(this.matchmaking[i].idGameLinked);
                    if (game.isOver)
                    {
                        if (game.isRanked == true)
                        {
                            const PrismaUser1 = await this.prisma.user.findUnique({where: { id: Number(game.userId1) },});
                            const PrismaUser2 = await this.prisma.user.findUnique({where: { id: Number(game.userId2) },});
                            if (!PrismaUser1 || !PrismaUser2)
                                break;

                            const newEloUser1 = this.eloCalc(PrismaUser1.elo, PrismaUser2.elo, game.scoreUser1, game.scoreUser2);
                            const newEloUser2 = this.eloCalc(PrismaUser2.elo, PrismaUser1.elo, game.scoreUser2, game.scoreUser1);

                            const PrismaUser1Updated = await prisma.user.update(
                            {
                                where:
                                {
                                    id: Number(game.userId1)
                                },
                                data:
                                {
                                    elo: newEloUser1
                                },
                            });

                            const PrismaUser2Updated = await prisma.user.update(
                            {
                                where:
                                {
                                    id: Number(game.userId2)
                                },
                                data:
                                {
                                    elo: newEloUser2
                                },
                            });

                            if (!PrismaUser1Updated || !PrismaUser2Updated)
                                break;
                            // check for rank;
                        }
                        delete this.matchmaking[i];
                        this.matchmaking.splice(i, 1);
                    }
                    // else
                    //     console.log("matchmaking Id:",this.matchmaking[i].id, " matched with game Id:", this.matchmaking[i].idGameLinked);
                }
            }

        }, 1000);
    }

    // find matchmaking with userId (or duel)
    async findMatchmakingByUser(userId: number): Promise<Matchmaking | undefined>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId))
            return this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        else
            return undefined;
    }

    // create matchmaking
    async createMatchmaking(userId: number, isRanked: boolean, isCyber: boolean): Promise<Matchmaking | undefined>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId))
        {
            // console.log("matchmaking Id is already present:",this.matchmaking.find((matchmaking) => matchmaking.userId == userId).id);
            return undefined;
        }

        const PrismaUser = await this.prisma.user.findUnique({where: { id: Number(userId) },});

        if (!PrismaUser)
        {
            // console.log("User with Id:",userId, " doesn't exist");
            return undefined;
        }

        const newMatchmaking: Matchmaking =
        {
            id: ++this.numberMatchmaking,
            userId: userId,
            userElo: PrismaUser.elo,
            isRanked: isRanked,
            isCyber: isCyber,
            date: new Date(),
            isDuel: false,
            isDuelAccepted: false,
            isMatchmakingLinked: false,
            idGameLinked: 0,
            idDuelLinked: 0,
        }

        this.matchmaking.push(newMatchmaking);
        return newMatchmaking;
    }

    async cancelMatchmaking(userId: number)
    {
        const matchmakingToDelete = this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        if (matchmakingToDelete && matchmakingToDelete.isDuel == false &&
            matchmakingToDelete.isMatchmakingLinked == false)
        {
            const index = this.matchmaking.indexOf(matchmakingToDelete);
            delete this.matchmaking[index];
            this.matchmaking.splice(index, 1);
            return true;
        }
        return false;
    }

    async createDuelRequest(userId: number, targetUserId: number, isCyber: boolean): Promise<Matchmaking | undefined>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId) ||
            this.matchmaking.find((matchmaking) => matchmaking.userId == targetUserId))
        {
            // console.log("matchmaking Id is already present for yourself and/or the target:",this.matchmaking.find((matchmaking) => matchmaking.userId == userId).id);
            return undefined;
        }

        const PrismaUser = await this.prisma.user.findUnique({where: { id: Number(userId) },});
        const PrismaUserTarget = await this.prisma.user.findUnique({where: { id: Number(targetUserId) },});

        if (!PrismaUser || !PrismaUserTarget)
            return undefined;

        const newDuel: Matchmaking =
        {
            id: ++this.numberMatchmaking,
            userId: userId,
            userElo: PrismaUser.elo,
            isRanked: false,
            isCyber: isCyber,
            date: new Date(),
            isDuel: true,
            isDuelAccepted: true,
            isMatchmakingLinked: true,
            idGameLinked: 0,
            idDuelLinked: 0,
        }

        const newDuelTarget: Matchmaking =
        {
            id: ++this.numberMatchmaking,
            userId: targetUserId,
            userElo: PrismaUserTarget.elo,
            isRanked: newDuel.isRanked,
            isCyber: newDuel.isCyber,
            date: newDuel.date,
            isDuel: newDuel.isDuel,
            isDuelAccepted: false,
            isMatchmakingLinked: newDuel.isMatchmakingLinked,
            idGameLinked: 0,
            idDuelLinked: newDuel.id,
        }

        newDuel.idDuelLinked = newDuelTarget.id;

        this.matchmaking.push(newDuel);
        this.matchmaking.push(newDuelTarget);
        return newDuel;
    }

    async acceptDuelRequest(userId: number): Promise<Matchmaking | undefined>
    {
        const duelToAccept = this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        const duelToAcceptLinked = this.matchmaking.find((matchmaking) => matchmaking.id == duelToAccept.idDuelLinked);
        const indexDuelLinked = this.matchmaking.indexOf(duelToAcceptLinked);
        if (duelToAccept.isDuel == false)
            return undefined;
        
        if (duelToAccept.isDuelAccepted == true && this.matchmaking[indexDuelLinked].isDuelAccepted == true)
            return undefined;

        duelToAccept.isDuelAccepted = true;
        return duelToAccept;
    }

    async cancelOrDenyDuelRequest(userId: number): Promise<boolean>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId) == undefined ||
            this.matchmaking.find((matchmaking) => matchmaking.userId == userId).isDuel == false ||
            this.matchmaking.find((matchmaking) => matchmaking.userId == userId).idGameLinked > 0)
            return false;

        const duelToDelete = this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        const duelToDeleteLinked = this.matchmaking.find((matchmaking) => matchmaking.id == duelToDelete.idDuelLinked);
        const indexDuelToDelete = this.matchmaking.indexOf(duelToDelete);

        delete this.matchmaking[indexDuelToDelete];
        this.matchmaking.splice(indexDuelToDelete, 1);

        const indexDuelToDeleteLinked = this.matchmaking.indexOf(duelToDeleteLinked);

        delete this.matchmaking[indexDuelToDeleteLinked];
        this.matchmaking.splice(indexDuelToDeleteLinked, 1);

        return true;
    }

    // create game from 2 matchmaking
    async createGame(matchmaking1: Matchmaking, matchmaking2: Matchmaking): Promise<number>
    {
        const gameId = await this.game.createNewGame(matchmaking1.userId, matchmaking2.userId, matchmaking1.isRanked, matchmaking1.isCyber);
        if (gameId)
            return gameId;
        else
            return -1;
    }

    private eloCalc(eloSelf: number, eloFoe: number, scoreSelf: number, scoreFoe: number): number
    {
        if (scoreSelf >= scoreFoe)
            return (eloSelf + (scoreSelf - scoreFoe) * (10 * eloFoe / eloSelf));
        else
            return (eloSelf + (scoreSelf - scoreFoe) * (10 * eloSelf / eloFoe))
    }
}