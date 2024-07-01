"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyGen = void 0;
const enums_1 = require("../enums");
class KeyGen {
    static gen(length, type) {
        let dict;
        switch (type) {
            case enums_1.KeyType.NUMERIC:
                dict = '0123456789';
                break;
            case enums_1.KeyType.ALPHANUMERIC:
                dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                break;
            default:
                dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
        }
        return Array.from({ length }, () => dict[Math.floor(Math.random() * dict.length)]).join('');
    }
}
exports.KeyGen = KeyGen;
//# sourceMappingURL=key-gen.js.map