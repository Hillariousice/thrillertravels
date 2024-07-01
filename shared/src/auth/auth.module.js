"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const googlestrategy_1 = require("../common/utils/googlestrategy");
const serailizer_1 = require("../common/utils/serailizer");
const mongoose_1 = require("@nestjs/mongoose");
const auth_controller_1 = require("./auth.controller");
const users_schema_1 = require("../givers/users.schema");
const auth_service_1 = require("./auth.service");
const local_strategy_1 = require("./local.strategy");
const jwt_strategy_1 = require("./jwt.strategy");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const token_verif_schema_1 = require("./token-verif.schema");
const users_module_1 = require("../givers/users.module");
const mail_module_1 = require("../mail/mail.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => mail_module_1.MailModule),
            mongoose_1.MongooseModule.forFeature([
                { name: users_schema_1.User.name, schema: users_schema_1.UserSchema },
                { name: token_verif_schema_1.TokenVerif.name, schema: token_verif_schema_1.EmailVerifSchema },
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            googlestrategy_1.GoogleStrategy,
            serailizer_1.SessionSerializer,
            {
                provide: 'AUTH_SERVICE',
                useClass: auth_service_1.AuthService,
            },
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map