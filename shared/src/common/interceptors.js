"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => ({
            status: context.switchToHttp().getResponse().statusCode == 200 ||
                context.switchToHttp().getResponse().statusCode == 201
                ? true
                : false,
            statusCode: context.switchToHttp().getResponse().statusCode,
            data: data || null,
        })), (0, rxjs_1.catchError)((error) => {
            if (error instanceof common_1.HttpException) {
                return (0, rxjs_1.throwError)({
                    status: false,
                    statusCode: error.getStatus(),
                    message: error.getResponse(),
                });
            }
            return (0, rxjs_1.throwError)({
                status: false,
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }));
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=interceptors.js.map