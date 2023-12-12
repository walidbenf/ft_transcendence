import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './interfaces/channel.interface';
import { IsMemberOf } from './interfaces/isMemberOf.interface';
import { ChannelMessage } from './interfaces/channelMessage.interface';
import { get } from 'http';

@Injectable()
export class ParseBooleanPipe implements PipeTransform<string, boolean> {
  transform(value: string, metadata: ArgumentMetadata): boolean {
    if (value.toLowerCase() === 'true') {
      return true;
    } else if (value.toLowerCase() === 'false') {
      return false;
    } else {
      throw new BadRequestException('Invalid boolean value');
    }
  }
}

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  // get all channels (to search for joining a channel)
  @Get()
  async findAllChannels(): Promise<Channel[]>
  {
    return this.channelService.findAllChannels();
  }

  @Get('/myChannel/:userId(\\d+)')
  async findMyChannels(
    @Param('userId') userId: number
  ): Promise<Channel[]>
  {
    return this.channelService.findMyChannels(userId);
  }

  @Get('/specificChannel/:channelId(\\d+)/:userId(\\d+)')
  async findSpecificChannels(
    @Param('channelId') channelId: number,
    @Param('userId') userId: number
  ): Promise<Channel | undefined>
  {
    return this.channelService.findSpecificChannels(channelId, userId);
  }

  @Post('/createChannel/:userId(\\d+)/:channelName/:channelPrivacy/:channelPass')
  async createChannelWithPass(
    @Param('userId')userId: number,
    @Param('channelName')channelName: string,
    @Param('channelPrivacy', ParseBooleanPipe)channelPrivacy: boolean,
    @Param('channelPass')channelPass: string
  ): Promise<Channel>
  {
    return this.channelService.createChannel(userId, channelName, channelPrivacy, channelPass);
  }

  @Post('/createChannel/:userId(\\d+)/:channelName/:channelPrivacy')
  async createChannelWihoutPass(
    @Param('userId')userId: number,
    @Param('channelName')channelName: string,
    @Param('channelPrivacy', ParseBooleanPipe)channelPrivacy: boolean,
  ): Promise<Channel>
  {
    return this.channelService.createChannel(userId, channelName, channelPrivacy, "");
  }

  @Put('/updateChannelName/:channelId(\\d+)/:userId(\\d+)/:newName')
  async updateChannelName(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('newName')newName: string,
  ): Promise<boolean>
  {
    return this.channelService.updateChannelName(channelId, userId, newName);
  }

  @Put('/updateChannelImage/:channelId(\\d+)/:userId(\\d+)/:newPathImage')
  async updateChannelImage(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('newPathImage')newPathImage: string,
  ): Promise<boolean>
  {
    return this.channelService.updateChannelImage(channelId, userId, newPathImage);
  }

  @Put('/updateChannelPrivacy/:channelId(\\d+)/:userId(\\d+)/:newPrivacy')
  async updateChannelPrivacy(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('newPrivacy')newPrivacy: boolean,
  ): Promise<boolean>
  {
    return this.channelService.updateChannelPrivacy(channelId, userId, newPrivacy);
  }

  @Put('/updateChannelPassword/:channelId(\\d+)/:userId(\\d+)/:newPassword')
  async updateChannelPassword(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('newPassword')newPassword: string,
  ): Promise<boolean>
  {
    return this.channelService.updateChannelPassword(channelId, userId, newPassword);
  }

  @Put('/updateChannelPassword/:channelId(\\d+)/:userId(\\d+)')
  async updateChannelNoPassword(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
  ): Promise<boolean>
  {
    return this.channelService.updateChannelPassword(channelId, userId, "");
  }

  @Delete('/deleteChannel/:channelId(\\d+)/:userId(\\d+)')
  async deleteChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
  ): Promise<boolean>
  {
    return this.channelService.deleteChannel(channelId, userId);
  }

  @Get('/getUsersOfChannel/:channelId(\\d+)/:userId(\\d+)')
  async getUsersOfChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
  ): Promise<IsMemberOf[]>
  {
    return this.channelService.getUsersOfChannel(channelId, userId);
  }

  @Post('/joinChannel/:channelId(\\d+)/:userId(\\d+)')
  async joinChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
  ): Promise<boolean>
  {
    return this.channelService.joinChannel(channelId, userId, "");
  }

  @Post('/joinChannel/:channelId(\\d+)/:userId(\\d+)/:password')
  async joinChannelWithPassword(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('password')password: string,
  ): Promise<boolean>
  {
    return this.channelService.joinChannel(channelId, userId, password);
  }

  @Post('/inviteChannel/:channelId(\\d+)/:userId(\\d+)/:userIdInvited(\\d+)')
  async inviteChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdInvited')userIdInvited: number,
  ): Promise<boolean>
  {
    return this.channelService.inviteChannel(channelId, userId, userIdInvited);
  }

  @Put('/banFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToBan(\\d+)')
  async banFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToBan')userIdToBan: number,
  ): Promise<boolean>
  {
    return this.channelService.banFromChannel(channelId, userId, userIdToBan);
  }

  @Delete('/unBanFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToUnBan(\\d+)')
  async unBanFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToUnBan')userIdToUnBan: number,
  ): Promise<boolean>
  {
    return this.channelService.unBanFromChannel(channelId, userId, userIdToUnBan);
  }

  @Put('/muteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToMute(\\d+)')
  async muteFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToMute')userIdToMute: number,
  ): Promise<boolean>
  {
    return this.channelService.muteFromChannel(channelId, userId, userIdToMute);
  }

  @Put('/unmuteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToUnMute(\\d+)')
  async unmuteFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToUnMute')userIdToUnMute: number,
  ): Promise<boolean>
  {
    return this.channelService.unmuteFromChannel(channelId, userId, userIdToUnMute);
  }

  @Put('/promoteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToPromote(\\d+)')
  async promoteFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToPromote')userIdToPromote: number,
  ): Promise<boolean>
  {
    return this.channelService.promoteFromChannel(channelId, userId, userIdToPromote);
  }

  @Put('/demoteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToDemote(\\d+)')
  async demoteFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToDemote')userIdToDemote: number,
  ): Promise<boolean>
  {
    return this.channelService.demoteFromChannel(channelId, userId, userIdToDemote);
  }

  @Put('/giveOwnershipChannelTo/:channelId(\\d+)/:userId(\\d+)/:userIdToGiveOwnership(\\d+)')
  async giveOwnershipChannelTo(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToGiveOwnership')userIdToGiveOwnership: number,
  ): Promise<boolean>
  {
    return this.channelService.giveOwnershipChannelTo(channelId, userId, userIdToGiveOwnership);
  }

  @Delete('/KickFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToKick(\\d+)')
  async KickFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdToKick')userIdToKick: number,
  ): Promise<boolean>
  {
    return this.channelService.KickFromChannel(channelId, userId, userIdToKick);
  }

  @Delete('/leaveChannel/:channelId(\\d+)/:userId(\\d+)')
  async leaveChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
  ): Promise<boolean>
  {
    return this.channelService.leaveChannel(channelId, userId);
  }

  @Get('/getAllMessageFromChannel/:channelId(\\d+)/:userId(\\d+)')
  async getAllMessageFromChannel(
    @Param('channelId') channelId: number,
    @Param('userId') userId: number
  ): Promise<ChannelMessage[]>
  {
    return this.channelService.getAllMessageFromChannel(channelId, userId);
  }

  @Post('/newMessageToChannel/:channelId(\\d+)/:userId(\\d+)/:content')
  async newMessageToChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('content')content: string
  ): Promise<boolean>
  {
    return this.channelService.newMessageToChannel(channelId, userId, content);
  }

  @Put('/updateMessageToChannel/:channelId(\\d+)/:userId(\\d+)/:dateMessageToUpdate/:content')
  async updateMessageToChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('dateMessageToDelete')dateMessageToUpdate: string,
    @Param('content')content: string,
  ): Promise<boolean>
  {
    return this.channelService.updateMessageToChannel(channelId, userId, dateMessageToUpdate, content);
  }

  @Delete('/deleteMessageFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdMessage(\\d+)/:dateMessageToDelete')
  async deleteMessageFromChannel(
    @Param('channelId')channelId: number,
    @Param('userId')userId: number,
    @Param('userIdMessage')userIdMessage: number,
    @Param('dateMessageToDelete')dateMessageToDelete: string,
  ): Promise<boolean>
  {
    return this.channelService.deleteMessageFromChannel(channelId, userId, userIdMessage, dateMessageToDelete);
  }
}