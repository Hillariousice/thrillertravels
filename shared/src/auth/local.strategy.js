"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const users_services_1 = require("../givers/users.services");
const token_handler_1 = require("../common/utils/token-handler");
const exceptions_1 = require("../common/exceptions");
const enums_1 = require("../common/enums");
const jwt_1 = require("@nestjs/jwt");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService, userService, jwtService) {
        super({
            usernameField: 'phone',
        });
        this.authService = authService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validate(phone, password) {
        const user = await this.userService.getCredential('phone', phone);
        if (!user?.userId) {
            throw (0, exceptions_1.UserNotFoundException)();
        }
        if (!user.phoneVerified && !user.emailVerified) {
            throw (0, exceptions_1.TargetNotVerifiedException)();
        }
        if (!(await token_handler_1.TokenHandler.verifyKey(user.password, password))) {
            throw (0, exceptions_1.IncorrectLoginCredentialsException)();
        }
        const payload = {
            email: user.email,
            sub: user.userId,
            phone: user.phone,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            role: enums_1.Role.USER,
        };
        return { userId: user.userId, jwt: this.jwtService.sign(payload) };
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_services_1.UsersService,
        jwt_1.JwtService])
], LocalStrategy);
//# sourceMappingURL=local.strategy.js.map