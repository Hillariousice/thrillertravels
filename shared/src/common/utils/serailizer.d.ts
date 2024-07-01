import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../givers/users.schema';
import { AuthService } from '../../auth/auth.service';
export declare class SessionSerializer extends PassportSerializer {
    private readonly authService;
    constructor(authService: AuthService);
    serializeUser(user: User, done: Function): void;
    deserializeUser(payload: any, done: Function): Promise<any>;
}
