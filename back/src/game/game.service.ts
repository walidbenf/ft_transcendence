import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game } from './interfaces/game.interface';


@Injectable()
export class GameService
{
  private game: Game[] = [];

  constructor(private prisma: PrismaService)
  {
    setInterval(() =>
    {
      const now = new Date()
      for (let i = 0; i < this.game.length; i++)
      {
        // console.log("game Id:",this.game[i].id);
        // console.log("          status_started   :", this.game[i].started);
        // console.log("          status_isOver    :", this.game[i].isOver);
        // console.log("          timeRemaining at :", this.game[i].timeRemaining);
        // console.log("          score            : [", this.game[i].scoreUser1, "/", this.game[i].scoreUser2, "]");
        // console.log("          pos player       : [", this.game[i].player1_posY, "/", this.game[i].player2_posY, "]");
        // console.log("          pos ball         : [", this.game[i].ball_posX.toFixed(3), ",", this.game[i].ball_posY.toFixed(3), "]");
        // console.log("          direction ball   : [", this.game[i].ball_directionX.toFixed(3), ",", this.game[i].ball_directionY.toFixed(3), "]");
        if (this.game[i].isOver)
          this.remove(this.game[i].id);
        else
          this.runningGame(this.game[i], now);
      }
    }, 10);
  }

  // find all active game (will be used for spectate)
  findAll(): Game[] {
    return this.game;
  }

  // find game by game ID (will be used to get info on current game)
  async findById(id: number): Promise<Game | undefined> {
    if (this.game.find((game) => game.id == id))
      return this.game.find((game) => game.id == id);
    else
    {
      const gamePrisma = await this.prisma.game.findUnique({where: { id: Number(id) },});

      if (!gamePrisma)
        return undefined;

      const olderGame: Game = {
        id: gamePrisma.id,
        userId1: gamePrisma.userId1,
        userId2: gamePrisma.userId2,
        isRanked: gamePrisma.isRanked,
        isCyber: gamePrisma.isCyber,
        isOver: gamePrisma.isOver,
        scoreUser1: gamePrisma.scoreUser1,
        scoreUser2: gamePrisma.scoreUser2,
        date: gamePrisma.date,
        started: false,
        timeRemaining: 0,
        player1_posY: 0,
        player2_posY: 0,
        ball_posY: 0,
        ball_posX: 0,
        ball_directionY: 0,
        ball_directionX: 0,
      }

      return olderGame;
    }
  }

  // find all games for one user (will be used to get game history for one user)
  async findAllForOneUser(id: number): Promise<Game[]>
  {
    const game_1 = this.game.filter((game) => game.userId1 == id || game.userId2 == id);

    const game_2_prisma = await this.prisma.game.findMany(
    {
      where:
      {
        OR:
        [
          { userId1: Number(id) },
          { userId2: Number(id) },
        ],
      },
    });
    
    for (let i = 0; i < game_2_prisma.length; i++)
    {
      if (!game_1.find((game) => game.id == game_2_prisma[i].id))
      {
        const olderGame: Game = {
          id: game_2_prisma[i].id,
          userId1: game_2_prisma[i].userId1,
          userId2: game_2_prisma[i].userId2,
          isRanked: game_2_prisma[i].isRanked,
          isCyber: game_2_prisma[i].isCyber,
          isOver: game_2_prisma[i].isOver,
          scoreUser1: game_2_prisma[i].scoreUser1,
          scoreUser2: game_2_prisma[i].scoreUser2,
          date: game_2_prisma[i].date,
          started: true,
          timeRemaining: 0,
          player1_posY: 0,
          player2_posY: 0,
          ball_posY: 0,
          ball_posX: 0,
          ball_directionY: 0,
          ball_directionX: 0,
        }
        game_1.push(olderGame);
      }
    }

    return game_1;
  }

  async updatePlayerPos(id: number, userId: number, playerPosY: number) {
    const gameToUpdate = this.game.find((game) => game.id == id);
    if (gameToUpdate && !gameToUpdate.isOver)
    {
      if (playerPosY > 1)
        playerPosY = 1;
      else if (playerPosY < -1)
        playerPosY = -1;
      if (userId == gameToUpdate.userId1)
        gameToUpdate.player1_posY = playerPosY;
      else if (userId == gameToUpdate.userId2)
        gameToUpdate.player2_posY = playerPosY;
    }
  }

  sandevistanSmash(gameId:number, userId: number)
  {
    console.log
    console.log("game Id:",gameId, ", user Id:",userId, " user Standevistan Smash");
  }

  sandevistanGuard(gameId:number, userId: number)
  {
    console.log
    console.log("game Id:",gameId, ", user Id:",userId, " user Standevistan Giard");
  }

  // create a new game (will be called by matchmaking service to create a game after matching 2 user) and return the game ID
  async createNewGame(userId1: number, userId2: number, isRanked: boolean , isCyber: boolean ): Promise<number>
  {
    if (userId1 == userId2)
    {
      return (0);
    }

    const PrismaUser1 = await this.prisma.user.findUnique({where: { id: Number(userId1) },});
    const PrismaUser2 = await this.prisma.user.findUnique({where: { id: Number(userId2) },});

    if (!PrismaUser1 || !PrismaUser2)
      return (0);

    const randomInt = Math.floor(Math.random() * 2);
    let directionX: number;

    if (randomInt == 0)
      directionX = -1;
    else
      directionX = 1;

    const newGamePrisma = await this.prisma.game.create(
    {
      data:
      {
        userId1: Number(userId1),
        userId2: Number(userId2),
        isRanked: Boolean(isRanked),
        isCyber: Boolean(isCyber),
      },
    });

    if (!newGamePrisma)
      return (-1);

    const newGame: Game = {
      id: newGamePrisma.id,
      userId1: newGamePrisma.userId1,
      userId2: newGamePrisma.userId2,
      isRanked: newGamePrisma.isRanked,
      isCyber: newGamePrisma.isCyber,
      isOver: newGamePrisma.isOver,
      scoreUser1: newGamePrisma.scoreUser1,
      scoreUser2: newGamePrisma.scoreUser2,
      date: newGamePrisma.date,
      started: false,
      timeRemaining: 125, //check if 2mn is enouth and not too much (and 5s before start)
      player1_posY: 0,
      player2_posY: 0,
      ball_posY: 0,
      ball_posX: 0,
      ball_directionY: 0.5,
      ball_directionX: directionX * 0.5,
    }
    this.game.push(newGame);

    return newGame.id;
  }

  // update a game (is called by constructor clock every 10ms)
  private async runningGame(gameToUpdate: Game, now: Date)
  {
    if (gameToUpdate && !gameToUpdate.isOver)
    {
      const elapsedMs = now.getTime() - gameToUpdate.date.getTime();
      gameToUpdate.timeRemaining = gameToUpdate.timeRemaining - elapsedMs / 1000;
      gameToUpdate.date = now;

      if (!gameToUpdate.started)
      {
        if (gameToUpdate.timeRemaining <= 120)
          gameToUpdate.started = true;
      }
      else if (!gameToUpdate.isOver)
      {
        if (gameToUpdate.timeRemaining <= 0)
        {
          gameToUpdate.timeRemaining = 0;
          gameToUpdate.isOver = true;
          // update ddb values
          const gameToUpdatePrisma = await this.prisma.game.update(
          {
            where: 
            { 
              id: gameToUpdate.id
            },
            data: 
            {
              isOver: gameToUpdate.isOver,
              scoreUser1: gameToUpdate.scoreUser1,
              scoreUser2: gameToUpdate.scoreUser2,
            },
          });

          if (!gameToUpdatePrisma)
            return ;
        }
        else
        {
          // update position of ball
          // Y Position (and manage collision with upper and lower border)
          gameToUpdate.ball_posY += gameToUpdate.ball_directionY * (elapsedMs / 1000);
          if (gameToUpdate.ball_posY >= 1)
          {
            gameToUpdate.ball_posY = 1 - (gameToUpdate.ball_posY - 1);
            gameToUpdate.ball_directionY *= -1;
          }
          else if (gameToUpdate.ball_posY <= -1)
          {
            gameToUpdate.ball_posY = -1 - (gameToUpdate.ball_posY + 1);
            gameToUpdate.ball_directionY *= -1;
          }

          // X Position (and manage collision with left and right border and player) (also manage score)
          gameToUpdate.ball_posX += gameToUpdate.ball_directionX * (elapsedMs / 1000);
          if (gameToUpdate.ball_posX >= 1)
          {
            if (gameToUpdate.player2_posY + 0.1 >= gameToUpdate.ball_posY &&
                gameToUpdate.player2_posY - 0.1 <= gameToUpdate.ball_posY)
            {
              gameToUpdate.ball_posX = 1 - (gameToUpdate.ball_posX - 1);
              // manage y direction and x direction (to keep the same speeed of ball)
              // the farther the ball is from the center of the player (only on Y)
              // the wyder is the angle of Y (maximum 60°)
              // management on gameToUpdate.ball_directionX *= -1; need to be changed with this
            }
            else
            {
              gameToUpdate.scoreUser1 += 1;
              gameToUpdate.ball_posX = 0;
              gameToUpdate.ball_posY = 0;
            }
            gameToUpdate.ball_directionX *= -1;
          }
          else if (gameToUpdate.ball_posX <= -1.0)
          {
            if (gameToUpdate.player1_posY + 0.1 >= gameToUpdate.ball_posY &&
                gameToUpdate.player1_posY - 0.1 <= gameToUpdate.ball_posY)
            {
              gameToUpdate.ball_posX = -1 - (gameToUpdate.ball_posX + 1);
              // same as last comment when ball_posX >= 1
            }
            else
            {
              gameToUpdate.scoreUser2 += 1;
              gameToUpdate.ball_posX = 0;
              gameToUpdate.ball_posY = 0;
            }
            gameToUpdate.ball_directionX *= -1;
          }
        }
      }
    }
  }

  // remove a game specified with a game ID : will be called after a game is over (this don't delete the game in the ddb)
  private remove(id: number): void
  {
    this.game = this.game.filter((game) => game.id !== id);
  }
}