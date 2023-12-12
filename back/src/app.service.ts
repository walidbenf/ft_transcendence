import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Blyat!';
  }
  getBnuuy(): string {
	return 'Bnuuuyy!' ;
  }
}
