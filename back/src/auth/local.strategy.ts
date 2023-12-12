import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const state = await this.authService.validUserPW(username, password);
    if (state == null) {
		console.log("[local strategy validate] exception gaming")
      throw new UnauthorizedException();
    }
    return state;
  }
}