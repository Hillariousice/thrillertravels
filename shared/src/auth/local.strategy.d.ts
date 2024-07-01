import { AuthService } from './auth.service';
import { UsersService } from '../givers/users.services';
import { JwtService } from '@nestjs/jwt';
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    private readonly userService;
    private readonly jwtService;
    constructor(authService: AuthService, userService: UsersService, jwtService: JwtService);
    validate(phone: string, password: string): Promise<any>;
}
export {};
