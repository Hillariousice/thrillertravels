import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.services';
import { TokenHandler } from '../common/utils/token-handler';

import {
  IncorrectLoginCredentialsException,
  TargetNotVerifiedException,
  UserNotFoundException,
} from '../common/exceptions';
import { Role } from '../common/enums';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super({
      usernameField: 'phone',
    });
  }

  async validate(phone: string, password: string): Promise<any> {
    const user = await this.userService.getCredential('phone', phone);

    if (!user?.userId) {
      throw UserNotFoundException();
    }

    // Check if the user is not verified.
    if (!user.phoneVerified && !user.emailVerified) {
      throw TargetNotVerifiedException();
    }
    // Compare the plain password to the hashed password.
    if (!(await TokenHandler.verifyKey(user.password, password))) {
      throw IncorrectLoginCredentialsException();
    }

    const payload = {
      email: user.email,
      sub: user.userId,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      role: Role.USER,
    };
    // Return the user ID and JWT token.
    return { userId: user.userId, jwt: this.jwtService.sign(payload) };
  }
}
