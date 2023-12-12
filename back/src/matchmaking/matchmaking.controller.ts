import {  Controller, Get, Post, Put, Param, Delete } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { Matchmaking } from './interfaces/matchmaking.interface';

@Controller('matchmaking')
export class MatchmakingController
{
  constructor(private matchmakingService: MatchmakingService) {}

    // return active matchmaking with userId
    @Get('/userId/:userId(\\d+)')
    async findMatchmakingByUser(
        @Param('userId') userId: number
    ): Promise<Matchmaking | undefined>
    {
        return this.matchmakingService.findMatchmakingByUser(userId);
    }

    // return active matchmaking for user
    @Post('/create/:userId(\\d+)/:isRanked/:isCyber')
    async createMatchmaking(
        @Param('userId') userId: number,
        @Param('isRanked') isRanked: boolean,
        @Param("isCyber") isCyber:boolean
    ): Promise<Matchmaking | undefined>
    {
        return this.matchmakingService.createMatchmaking(userId, isRanked, isCyber);
    }

    @Delete('/cancel/:userId(\\d+)')
    cancelMatchmaking(
        @Param('userId') userId: number
    ): Promise <Boolean>
    {
        return this.matchmakingService.cancelMatchmaking(userId);
    }


    @Post('/initiateDuel/:userId(\\d+)/:targetUserId(\\d+)/:isCyber')
    initiateDuel(
        @Param('userId') userId: number,
        @Param('targetUserId') targetUserId: number,
        @Param("isCyber") isCyber:boolean
    ): Promise<Matchmaking | undefined>
    {
        return this.matchmakingService.createDuelRequest(userId, targetUserId, isCyber);
    }

    @Put('/acceptDuel/:userId(\\d+)')
    acceptDuel(
        @Param('userId') userId: number
    ): Promise<Matchmaking | undefined>
    {
        return this.matchmakingService.acceptDuelRequest(userId);
    }

    @Delete('/cancelDuel/:userId(\\d+)')
    cancelDuel(
        @Param('userId') userId: number
    ): Promise<boolean>
    {
        return this.matchmakingService.cancelOrDenyDuelRequest(userId);
    }
}