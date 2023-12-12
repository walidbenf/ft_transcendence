export interface Matchmaking
{
    id: number; // id matchmaking
    userId: number; // id user
    userElo: number; // helo of the user
    isRanked: boolean; // is the game searched is a ranked
    isCyber: boolean; // are powerups active
    date: Date; // date of the start of the matchmaking
    isDuel; // if the matchmaking is a duel
    isDuelAccepted: boolean; // if the duel is accepted
    isMatchmakingLinked: boolean; // if the matchmaking is linked with another matchmaking
    idGameLinked: number; // id of the game linked --> 0 = no game linked
    idDuelLinked: number; // id of the matchmaking linked : only for duel
  }