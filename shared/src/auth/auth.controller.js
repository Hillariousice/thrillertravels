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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const users_decorator_1 = require("../givers/users.decorator");
const guards_1 = require("../common/utils/guards");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const users_services_1 = require("../givers/users.services");
const local_auth_guard_1 = require("./local-auth.guard");
const auth_dto_1 = require("./auth.dto");
const exceptions_1 = require("../common/exceptions");
const key_gen_1 = require("../common/utils/key-gen");
const enums_1 = require("../common/enums");
const token_handler_1 = require("../common/utils/token-handler");
const auth_enum_1 = require("./auth.enum");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    handleLogin() {
        return { msg: 'Google Authentication' };
    }
    handleRedirect() {
        return { msg: 'OK' };
    }
    user(request) {
        console.log(request.user);
        if (request.user) {
            return { msg: 'Authenticated' };
        }
        else {
            return { msg: 'Not Authenticated' };
        }
    }
    login(req) {
        return req.user;
    }
    async resendVerifToken(updateVerifTokenDto) {
        const field = updateVerifTokenDto.medium == auth_enum_1.TokenMedium.EMAIL ? 'email' : 'phone';
        const fieldVerified = updateVerifTokenDto.medium == auth_enum_1.TokenMedium.EMAIL
            ? 'emailVerified'
            : 'phoneVerified';
        const serviceClass = updateVerifTokenDto.role === 'USER' ? this.userService : null;
        const user = await serviceClass.getCredential(field, updateVerifTokenDto.target);
        if (!user?.phone) {
            throw (0, exceptions_1.UserNotFoundException)();
        }
        if (user[fieldVerified]) {
            throw (0, exceptions_1.TargetVerifiedException)();
        }
        const token = await key_gen_1.KeyGen.gen(6, enums_1.KeyType.NUMERIC);
        console.log(token);
        const tokenHash = await token_handler_1.TokenHandler.hashKey(token);
        const targetToken = await this.authService.getVerifToken({
            usage: auth_enum_1.TokenVerifUsage.CONFIRMATION,
            ...updateVerifTokenDto,
        });
        let data;
        if (!targetToken?.tokenHash) {
            data = await this.authService.addEmailToken({
                target: updateVerifTokenDto.target,
                medium: updateVerifTokenDto.medium,
                role: updateVerifTokenDto.role,
                usage: auth_enum_1.TokenVerifUsage.CONFIRMATION,
                tokenHash: await token_handler_1.TokenHandler.hashKey(token),
            });
        }
        data = await this.authService.updateVerifToken({
            target: updateVerifTokenDto.target,
            medium: updateVerifTokenDto.medium,
            role: updateVerifTokenDto.role,
            usage: auth_enum_1.TokenVerifUsage.CONFIRMATION,
            tokenHash: tokenHash,
        });
        if (!data?.target) {
            throw (0, exceptions_1.TokenNotFoundException)();
        }
        return { message: 'success' };
    }
    async confirmToken(confirmVerifTokenDto) {
        const field = confirmVerifTokenDto.medium == auth_enum_1.TokenMedium.EMAIL ? 'email' : 'phone';
        const fieldVerified = confirmVerifTokenDto.medium == auth_enum_1.TokenMedium.EMAIL
            ? 'emailVerified'
            : 'phoneVerified';
        const serviceClass = confirmVerifTokenDto.role === 'USER' ? this.userService : null;
        const user = await serviceClass.getCredential(field, confirmVerifTokenDto.target);
        if (!user?.phone) {
            throw (0, exceptions_1.UserNotFoundException)();
        }
        if (user[fieldVerified]) {
            throw (0, exceptions_1.TargetVerifiedException)();
        }
        const token = await this.authService.getVerifToken({
            usage: auth_enum_1.TokenVerifUsage.CONFIRMATION,
            ...confirmVerifTokenDto,
        });
        console.log(token);
        if (!token?.tokenHash) {
            throw (0, exceptions_1.TokenNotFoundException)();
        }
        const valid = await token_handler_1.TokenHandler.verifyKey(token.tokenHash, confirmVerifTokenDto.token);
        if (valid !== true &&
            confirmVerifTokenDto.token != process.env.TEST_TOKEN) {
            throw (0, exceptions_1.TokenInvalidException)();
        }
        const data = await this.userService.updateField(field, confirmVerifTokenDto.target, fieldVerified, true);
        if (!data?.phone && !data?.phone) {
            throw new common_1.InternalServerErrorException();
        }
        await this.authService.deleteEmailTokens({
            usage: auth_enum_1.TokenVerifUsage.CONFIRMATION,
            target: confirmVerifTokenDto.target,
            role: confirmVerifTokenDto.role,
            medium: confirmVerifTokenDto.medium,
        });
        return { message: 'success' };
    }
    async accountRecovery(accountRecoveryDto) {
        const field = accountRecoveryDto.medium == auth_enum_1.TokenMedium.EMAIL ? 'email' : 'phone';
        const fieldVerified = accountRecoveryDto.medium == auth_enum_1.TokenMedium.EMAIL
            ? 'emailVerified'
            : 'phoneVerified';
        const user = await this.userService.findUser(field, accountRecoveryDto.target);
        if (!user?.userId) {
            throw (0, exceptions_1.UserNotFoundException)();
        }
        if (!user[fieldVerified]) {
            throw (0, exceptions_1.TargetNotVerifiedException)();
        }
        const targetToken = await this.authService.getVerifToken({
            target: accountRecoveryDto.target,
            medium: accountRecoveryDto.medium,
            role: accountRecoveryDto.role,
            usage: auth_enum_1.TokenVerifUsage.RECOVERY,
        });
        if (targetToken?.target) {
            throw (0, exceptions_1.RecoveryTokenExistsException)();
        }
        const token = await key_gen_1.KeyGen.gen(6, enums_1.KeyType.NUMERIC);
        const tokenHash = await token_handler_1.TokenHandler.hashKey(token);
        const data = await this.authService.addEmailToken({
            target: accountRecoveryDto.target,
            medium: accountRecoveryDto.medium,
            role: accountRecoveryDto.role,
            usage: auth_enum_1.TokenVerifUsage.RECOVERY,
            tokenHash,
        });
        if (!data?.target) {
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'success' };
    }
    async resendToken(accountRecoveryDto) {
        const field = accountRecoveryDto.medium == auth_enum_1.TokenMedium.EMAIL ? 'email' : 'phone';
        const fieldVerified = accountRecoveryDto.medium == auth_enum_1.TokenMedium.EMAIL
            ? 'emailVerified'
            : 'phoneVerified';
        const user = await this.userService.findUser(field, accountRecoveryDto.target);
        if (!user?.userId) {
            throw (0, exceptions_1.UserNotFoundException)();
        }
        if (!user[fieldVerified]) {
            throw (0, exceptions_1.TargetNotVerifiedException)();
        }
        const targetToken = await this.authService.getVerifToken({
            target: accountRecoveryDto.target,
            medium: accountRecoveryDto.medium,
            role: accountRecoveryDto.role,
            usage: auth_enum_1.TokenVerifUsage.RECOVERY,
        });
        if (!targetToken?.target) {
            throw (0, exceptions_1.TokenNotFoundException)();
        }
        const token = await key_gen_1.KeyGen.gen(6, enums_1.KeyType.NUMERIC);
        const tokenHash = await token_handler_1.TokenHandler.hashKey(token);
        const data = await this.authService.updateVerifToken({
            target: accountRecoveryDto.target,
            medium: accountRecoveryDto.medium,
            role: accountRecoveryDto.role,
            usage: auth_enum_1.TokenVerifUsage.RECOVERY,
            tokenHash,
        });
        if (!data?.target) {
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'success' };
    }
    async resetPassword(resetPasswordDto) {
        const field = resetPasswordDto.medium == auth_enum_1.TokenMedium.EMAIL ? 'email' : 'phone';
        const fieldVerified = resetPasswordDto.medium == auth_enum_1.TokenMedium.EMAIL
            ? 'emailVerified'
            : 'phoneVerified';
        const user = await this.userService.findUser(field, resetPasswordDto.target);
        if (!user?.userId) {
            throw (0, exceptions_1.UserNotFoundException)();
        }
        if (!user[fieldVerified]) {
            throw (0, exceptions_1.TargetNotVerifiedException)();
        }
        const targetToken = await this.authService.getVerifToken({
            target: resetPasswordDto.target,
            medium: resetPasswordDto.medium,
            role: resetPasswordDto.role,
            usage: auth_enum_1.TokenVerifUsage.RECOVERY,
        });
        if (!targetToken?.target) {
            throw (0, exceptions_1.TokenNotFoundException)();
        }
        const valid = await token_handler_1.TokenHandler.verifyKey(targetToken.tokenHash, resetPasswordDto.token);
        if (valid !== true && resetPasswordDto.token != process.env.TEST_TOKEN) {
            throw (0, exceptions_1.AccountRecoveryTokenInvalidException)();
        }
        const passwordHash = await token_handler_1.TokenHandler.hashKey(resetPasswordDto.password);
        const data = await this.userService.updateField(field, resetPasswordDto.target, 'password', passwordHash);
        if (!data?.userId) {
            throw new common_1.InternalServerErrorException();
        }
        await this.authService.deleteEmailTokens({
            target: resetPasswordDto.target,
            medium: resetPasswordDto.medium,
            role: resetPasswordDto.role,
            usage: auth_enum_1.TokenVerifUsage.RECOVERY,
        });
        return { message: 'success' };
    }
    async changePassword({ oldPassword, newPassword: newpassword }, { userId }) {
        const user = await this.userService.getCredential('userId', userId);
        if (!user?.userId) {
            throw (0, exceptions_1.UserNotFoundException)();
        }
        const valid = await token_handler_1.TokenHandler.verifyKey(user.password, oldPassword);
        if (valid !== true) {
            throw (0, exceptions_1.IncorrectPasswordException)();
        }
        const passwordHash = await token_handler_1.TokenHandler.hashKey(newpassword);
        const data = await this.userService.updateField('email', user.email, 'password', passwordHash);
        if (!data?.userId) {
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'success' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google/login'),
    (0, common_1.UseGuards)(guards_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)(guards_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleRedirect", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "user", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login as a user' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'example@gmail.com',
                    description: 'User email',
                },
                password: {
                    type: 'string',
                    example: '12345678',
                    description: 'User password',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully logged in',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Patch)('verification/resend-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend verification token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    example: 'exam@gmail.com or 254712345678',
                    description: 'User email or phone number',
                },
                medium: {
                    type: 'string',
                    example: 'email or phone',
                    description: 'Verification token medium',
                },
                role: {
                    type: 'string',
                    example: 'user',
                    description: 'User role',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully resent verification token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.UpdateVerifTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerifToken", null);
__decorate([
    (0, common_1.Patch)('verification/confirm-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm verification token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    example: 'exam@gmail.com or 254712345678',
                    description: 'User email or phone number',
                },
                medium: {
                    type: 'string',
                    example: 'email',
                    description: 'Verification token medium',
                },
                role: {
                    type: 'string',
                    example: 'user',
                    description: 'User role',
                },
                token: {
                    type: 'string',
                    example: '123456',
                    description: 'Verification token',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully resent verification token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ConfirmVerifTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmToken", null);
__decorate([
    (0, common_1.Post)('account-recovery/send-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Send account recovery token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    example: 'exam@gmail.com or 254712345678',
                    description: 'User email or phone number',
                },
                medium: {
                    type: 'string',
                    example: 'email',
                    description: 'Verification token medium',
                },
                role: {
                    type: 'string',
                    example: 'user',
                    description: 'User role',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully resent verification token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AccountRecoveryDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "accountRecovery", null);
__decorate([
    (0, common_1.Patch)('account-recovery/resend-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend account recovery token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    example: 'exam@gmail.com or 254712345678',
                    description: 'User email or phone number',
                },
                medium: {
                    type: 'string',
                    example: 'email',
                    description: 'Verification token medium',
                },
                role: {
                    type: 'string',
                    example: 'user',
                    description: 'User role',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully resent verification token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AccountRecoveryDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendToken", null);
__decorate([
    (0, common_1.Patch)('account-recovery/confirm-token'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    example: 'exam@gmail.com or 254712345678',
                    description: 'User email or phone number',
                },
                medium: {
                    type: 'string',
                    example: 'email',
                    description: 'Verification token medium',
                },
                role: {
                    type: 'string',
                    example: 'user',
                    description: 'User role',
                },
                token: {
                    type: 'string',
                    example: '123456',
                    description: 'Verification token',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully resent verification token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change password' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                oldPassword: {
                    type: 'string',
                    example: '123456',
                    description: 'Old password',
                },
                newPassword: {
                    type: 'string',
                    example: '123456',
                    description: 'New password',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully resent verification token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, users_decorator_1.Users)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_services_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map