import { Controller, Get, Put, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './interfaces/game.interface';

@Controller('game')
export class GameController
{
  constructor(public gameService: GameService) {}

  // should not use this for the moment (will be used for spectate)
  @Get()
  async findAll(): Promise<Game[]>
  {
    return this.gameService.findAll();
  }

  // return all games for one user (will be used for history)
  @Get('/userId/:id(\\d+)')
  async findAllForOneUser(
    @Param('id') id: number
  ): Promise<Game[]>
  {
    return this.gameService.findAllForOneUser(id);
  }

  // return one game by id (will be used for getting info on current game (for player and spectator))
  @Get('/gameId/:id(\\d+)')
  async findOne(
    @Param('id') id: number
  ): Promise<Game | undefined>
  {
    return this.gameService.findById(id);
  }

  // will update the position of the player on a game 
  @Put('/actGame/:id/:userId/:playerPosY')
  async update(
    @Param('id') id: number, 
    @Param('userId') userId: number, 
    @Param('playerPosY') playerPosY: number
  )
  {
    this.gameService.updatePlayerPos(id, userId, playerPosY);
  }

  // will update the position of the player on a game 
  @Put('/sandevistanSmash/:id/:userId/')
  async sandevistanSmash(
    @Param('id') id: number, 
    @Param('userId') userId: number, 
  )
  {
    this.gameService.sandevistanSmash(id, userId);
  }

  // will update the position of the player on a game 
  @Put('/sandevistanGuard/:id/:userId/')
  async sandevistanGuard(
    @Param('id') id: number, 
    @Param('userId') userId: number, 
  )
  {
    this.gameService.sandevistanGuard(id, userId);
  }
}