export interface Game
{
  id: number;
  userId1: number; // left player
  userId2: number; // right player
  isRanked: boolean; // did this game is ranked
  isCyber: boolean; // are powerups active
  isOver: boolean;
  scoreUser1: number;
  scoreUser2: number;
  date: Date;
  // BELOW NOT IN THE DB
  started: boolean;
  timeRemaining: number;
  player1_posY: number; // vertical position beetween -1 (down the game area) and 1 (top the game area)
  player2_posY: number; // same but for player 2
  ball_posY: number; // Same as player but for the ball position
  ball_posX: number; // Same but for horizontal position -1 (left) and 1 (right)
  ball_directionY: number; // direction
  ball_directionX: number; // direction
}