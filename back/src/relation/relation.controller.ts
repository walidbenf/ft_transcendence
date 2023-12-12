import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { RelationService } from './relation.service';
import { Friend } from './interfaces/friend.interface';
import { Blocked } from './interfaces/blocked.interface';

@Controller('relation')
export class RelationController {
  constructor(private relationService: RelationService) {}

  @Get('/findMyBlocked/:userId(\\d+)')
  findMyBlocked(
    @Param('userId') userId: number
  ): Blocked[]
  {
    return this.relationService.findMyBlocked(userId);
  }

  @Post('/blockSomeone/:userId(\\d+)/:userIdToBlock(\\d+)')
  blockSomeone(
    @Param('userId') userId: number,
    @Param('userIdToBlock') userIdToBlock: number
  ): Promise<boolean>
  {
    return this.relationService.blockSomeone(userId, userIdToBlock);
  }

  @Delete('/unBlockSomeone/:userId(\\d+)/:userIdToUnBlock(\\d+)')
  unBlockSomeone(
    @Param('userId') userId: number,
    @Param('userIdToUnBlock') userIdToUnBlock: number
  ): Promise<boolean>
  {
    return this.relationService.unBlockSomeone(userId, userIdToUnBlock);
  }

  @Get('/findMyFriend/:userId(\\d+)')
  findMyFriend(
    @Param('userId') userId: number
  ): Friend[]
  {
    return this.relationService.findMyFriend(userId);
  }

  @Get('/findMyPendingRequest/:userId(\\d+)')
  findMyPendingRequest(
    @Param('userId') userId: number
  ): Friend[]
  {
    return this.relationService.findMyPendingRequests(userId);
  }

  @Get('/findFriendEmmitedRequest/:userId(\\d+)')
  findMyEmmitedRequest(
    @Param('userId') userId: number
  ): Friend[]
  {
    return this.relationService.findMyEmmitedRequest(userId);
  }

  @Post('/emmitOrAcceptFriendRequest/:userId(\\d+)/:userIdRequest(\\d+)')
  emmitOrAcceptFriendRequest(
    @Param('userId') userId: number,
    @Param('userIdRequest') userIdRequest: number
  ): Promise<boolean>
  {
    return this.relationService.addFriend(userId, userIdRequest);
  }

  // to remove, cancel or refuse a friend request
  @Delete('/removeFriend/:userId(\\d+)/:userIdToRemove(\\d+)')
  removeFriend(
    @Param('userId') userId: number,
    @Param('userIdToRemove') userIdToRemove: number
  ): Promise<boolean>
  {
    return this.relationService.removeFriend(userId, userIdToRemove);
  }
}