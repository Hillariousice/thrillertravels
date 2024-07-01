"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const common_1 = require("@nestjs/common");
exports.Users = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
//# sourceMappingURL=users.decorator.js.map