export interface ChannelMessage
{
    userId: number; // user id
    channelId: number; // channel id
    date: Date; // date of message send or updated
    content: string; // message content
}