"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenHandler = void 0;
const argon2_1 = require("argon2");
class TokenHandler {
    static async hashKey(key) {
        try {
            return await argon2_1.default.hash(key);
        }
        catch (error) {
            console.error(error);
        }
    }
    static async verifyKey(hash, plain) {
        try {
            return await argon2_1.default.verify(hash, plain);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.TokenHandler = TokenHandler;
//# sourceMappingURL=token-handler.js.map