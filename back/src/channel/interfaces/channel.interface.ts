export interface Channel
{
  id: number; // channel id
  name: string; // channel name
  pathImage: string; // path of channel image
  privacy: boolean; // true if private
//   password: string; // do not use ... only question ddb about that, do not store
  creation: Date; // date of creation
}
