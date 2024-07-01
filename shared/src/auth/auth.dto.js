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
exports.ChangePasswordDto = exports.ResetPasswordDto = exports.AccountRecoveryDto = exports.SetPasswordDto = exports.ConfirmVerifTokenDto = exports.UpdateVerifTokenDto = void 0;
const class_validator_1 = require("class-validator");
const enums_1 = require("../common/enums");
const auth_enum_1 = require("./auth.enum");
class UpdateVerifTokenDto {
}
exports.UpdateVerifTokenDto = UpdateVerifTokenDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateVerifTokenDto.prototype, "target", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.Role),
    __metadata("design:type", String)
], UpdateVerifTokenDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(auth_enum_1.TokenMedium),
    __metadata("design:type", String)
], UpdateVerifTokenDto.prototype, "medium", void 0);
class ConfirmVerifTokenDto {
}
exports.ConfirmVerifTokenDto = ConfirmVerifTokenDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmVerifTokenDto.prototype, "target", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(auth_enum_1.TokenMedium),
    __metadata("design:type", String)
], ConfirmVerifTokenDto.prototype, "medium", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.Role),
    __metadata("design:type", String)
], ConfirmVerifTokenDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], ConfirmVerifTokenDto.prototype, "token", void 0);
class SetPasswordDto {
}
exports.SetPasswordDto = SetPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetPasswordDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SetPasswordDto.prototype, "password", void 0);
class AccountRecoveryDto {
}
exports.AccountRecoveryDto = AccountRecoveryDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountRecoveryDto.prototype, "target", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.Role),
    __metadata("design:type", String)
], AccountRecoveryDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(auth_enum_1.TokenMedium),
    __metadata("design:type", String)
], AccountRecoveryDto.prototype, "medium", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "target", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.Role),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(auth_enum_1.TokenMedium),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "medium", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=auth.dto.js.map