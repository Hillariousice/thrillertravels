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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_enum_1 = require("../auth/auth.enum");
const auth_service_1 = require("../auth/auth.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const enums_1 = require("../common/enums");
const exceptions_1 = require("../common/exceptions");
const key_gen_1 = require("../common/utils/key-gen");
const token_handler_1 = require("../common/utils/token-handler");
const users_decorator_1 = require("./users.decorator");
const users_dto_1 = require("./users.dto");
const swagger_1 = require("@nestjs/swagger");
const users_services_1 = require("./users.services");
const mail_service_1 = require("../mail/mail.service");
let UsersController = class UsersController {
    constructor(usersService, authService, mailService) {
        this.usersService = usersService;
        this.authService = authService;
        this.mailService = mailService;
    }
    async addUser(addUserDto) {
        const data = await this.usersService.findUser('phone', addUserDto.phone);
        console.log(data);
        if (data?.phone && data?.phoneVerified) {
            throw (0, exceptions_1.VerifiedPhoneAlreadyExistsException)();
        }
        if (data?.phone && !data.phoneVerified) {
            throw (0, exceptions_1.PhoneAlreadyUsedException)();
        }
        if (data?.email && data?.emailVerified) {
            throw (0, exceptions_1.VerifiedEmailAlreadyExistsException)();
        }
        if (data?.phone && !data.phoneVerified) {
            throw (0, exceptions_1.EmailAlreadyUsedException)();
        }
        addUserDto.password = await token_handler_1.TokenHandler.hashKey(addUserDto.password);
        const user = await this.usersService.addUser(addUserDto);
        console.log(user);
        if (!user?.userId) {
            throw new common_1.InternalServerErrorException();
        }
        const token = await key_gen_1.KeyGen.gen(6, enums_1.KeyType.NUMERIC);
        console.log(token);
        await this.authService.addEmailToken({
            target: addUserDto.email,
            medium: auth_enum_1.TokenMedium.EMAIL,
            role: enums_1.Role.USER,
            usage: auth_enum_1.TokenVerifUsage.CONFIRMATION,
            tokenHash: await token_handler_1.TokenHandler.hashKey(token),
        });
        await this.mailService.accountActivationMail({
            token,
            firstName: addUserDto.firstname,
            email: addUserDto.email,
        });
        return {
            target: addUserDto.email,
            medium: auth_enum_1.TokenMedium.EMAIL,
            role: enums_1.Role.USER,
        };
    }
    async getProfile({ userId }) {
        return await this.usersService.findUser('userId', userId);
    }
    async updateProfile(updateProfileDto, { userId }) {
        return await this.usersService.updateProfile(userId, updateProfileDto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new user' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstname: {
                    type: 'string',
                    example: 'John',
                    description: 'User first name',
                },
                lastname: {
                    type: 'string',
                    example: 'Doe',
                    description: 'User last name',
                },
                email: {
                    type: 'string',
                    example: 'example@gmail.com',
                    description: 'User email',
                },
                phone: {
                    type: 'string',
                    example: '254712345678',
                    description: 'User phone number',
                },
                country: {
                    type: 'string',
                    example: 'KE',
                    description: 'User country',
                },
                password: {
                    type: 'string',
                    example: 'password',
                    description: 'User password',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully created user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal Server Error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.AddUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addUser", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        type: 'string',
        description: 'User id',
        example: '60f8e4d6a5c3f2f8c4b7b7a6',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully fetched user profile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal Server Error',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, users_decorator_1.Users)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('me/profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        type: 'string',
        description: 'User id',
        example: '60f8e4d6a5c3f2f8c4b7b7a6',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstname: {
                    type: 'string',
                    example: 'John',
                    description: 'User first name',
                },
                lastname: {
                    type: 'string',
                    example: 'Doe',
                    description: 'User last name',
                },
                address: {
                    type: 'string',
                    example: 'Nairobi',
                    description: 'User address',
                },
                dob: {
                    type: 'string',
                    example: '2021-07-22T00:00:00.000Z',
                    description: 'User date of birth',
                },
                country: {
                    type: 'string',
                    example: 'KE',
                    description: 'User country',
                },
                photo: {
                    type: 'string',
                    example: 'https://res.cloudinary.com/dq7l8216n/image/upload/v1626971233/avatars/60f8e4d6a5c3f2f8c4b7b7a6.jpg',
                    description: 'User photo',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully updated user profile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal Server Error',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, users_decorator_1.Users)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_services_1.UsersService,
        auth_service_1.AuthService,
        mail_service_1.MailService])
], UsersController);
//# sourceMappingURL=users.controller.js.map