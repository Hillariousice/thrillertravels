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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("../givers/users.schema");
const token_verif_schema_1 = require("./token-verif.schema");
let AuthService = class AuthService {
    constructor(userModel, emailVerifModel) {
        this.userModel = userModel;
        this.emailVerifModel = emailVerifModel;
    }
    async validateUser(details) {
        console.log('AuthService');
        console.log(details);
        const user = await this.userModel.findOne({ email: details.email }).exec();
        console.log(user);
        if (user) {
            return user;
        }
        console.log('User not found. Creating...');
        const newUser = new this.userModel(details);
        await newUser.save();
        return newUser;
    }
    async findUser(id) {
        return await this.userModel.findById(id).exec();
    }
    async addEmailToken(addEmailVerifParams) {
        return await this.emailVerifModel.create(addEmailVerifParams);
    }
    async getVerifToken({ medium, target, usage, }) {
        return await this.emailVerifModel.findOne({
            target,
            usage,
            medium,
        });
    }
    async updateVerifToken({ target, usage, medium, tokenHash, }) {
        return await this.emailVerifModel.findOneAndUpdate({ medium, target, usage }, { tokenHash: tokenHash }, { new: true });
    }
    async deleteEmailTokens({ medium, target, usage, }) {
        return await this.emailVerifModel.deleteMany({ target, medium, usage });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(token_verif_schema_1.TokenVerif.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map