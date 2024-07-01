import { Profile } from 'passport-google-oauth20';
import { AuthService } from '../../auth/auth.service';
declare const GoogleStrategy_base: new (...args: any[]) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<import("../../givers/users.schema").User>;
}
export {};
