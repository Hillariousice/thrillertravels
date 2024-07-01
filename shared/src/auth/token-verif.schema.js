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
exports.EmailVerifSchema = exports.TokenVerif = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const auth_enum_1 = require("./auth.enum");
let TokenVerif = class TokenVerif {
};
exports.TokenVerif = TokenVerif;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TokenVerif.prototype, "target", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: auth_enum_1.TokenMedium }),
    __metadata("design:type", String)
], TokenVerif.prototype, "medium", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TokenVerif.prototype, "tokenHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: auth_enum_1.TokenVerifUsage }),
    __metadata("design:type", String)
], TokenVerif.prototype, "usage", void 0);
exports.TokenVerif = TokenVerif = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TokenVerif);
const EmailVerifSchema = mongoose_1.SchemaFactory.createForClass(TokenVerif);
exports.EmailVerifSchema = EmailVerifSchema;
//# sourceMappingURL=token-verif.schema.js.map