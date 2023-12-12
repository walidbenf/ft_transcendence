export interface IsMemberOf
{
    userId: number; // user id
    channelId: number; // channel id
    status: string; // status of the member : only "OWNER", "ADMIN", "MEMBER", "MUTED", "INVITED", "BANNED"
    dateJoined: Date; // date of joining channel
}