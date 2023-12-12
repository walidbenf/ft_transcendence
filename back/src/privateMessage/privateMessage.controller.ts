import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PrivateMessageService } from './privateMessage.service';
import { PrivateMessage } from './interfaces/privateMessage.interface';

@Controller('privateMessage')
export class PrivateMessageController {
  constructor(private relationService: PrivateMessageService) {}

  @Get('/getAllUserWithPrivateMessage/:userId(\\d+)')
  async getAllUserWithPrivateMessage(
    @Param('userId') userId: number,
  ): Promise<number[]>
  {
    return this.relationService.getAllUserWithPrivateMessage(userId);
  }

  @Get('/getAllMessageFromUser/:userId(\\d+)/:OtherUserId(\\d+)')
  async getAllMessageFromUser(
    @Param('userId') userId: number,
    @Param('OtherUserId') OtherUserId: number
  ): Promise<PrivateMessage[]>
  {
    return this.relationService.getAllMessageFromUser(userId, OtherUserId);
  }

  @Post('/newMessageToUser/:userId(\\d+)/:OtherUserId(\\d+)/:content')
  async newMessageToUser(
    @Param('userId')userId: number,
    @Param('OtherUserId')OtherUserId: number,
    @Param('content')content: string
  ): Promise<boolean>
  {
    return this.relationService.newMessageToUser(userId, OtherUserId, content);
  }

  @Put('/updateMessageToUser/:userId(\\d+)/:OtherUserId(\\d+)/:dateMessageToUpdate/:content')
  async updateMessageToUser(
    @Param('userId')userId: number,
    @Param('OtherUserId')OtherUserId: number,
    @Param('dateMessageToDelete')dateMessageToUpdate: string,
    @Param('content')content: string,
  ): Promise<boolean>
  {
    return this.relationService.updateMessageToUser(userId, OtherUserId, dateMessageToUpdate, content);
  }

  @Delete('/deleteMessageToUser/:userId(\\d+)/:OtherUserId(\\d+)/:dateMessageToDelete')
  async deleteMessageToUser(
    @Param('userId')userId: number,
    @Param('OtherUserId')OtherUserId: number,
    @Param('dateMessageToDelete')dateMessageToDelete: string,
  ): Promise<boolean>
  {
    return this.relationService.deleteMessageToUser(userId, OtherUserId, dateMessageToDelete);
  }

}