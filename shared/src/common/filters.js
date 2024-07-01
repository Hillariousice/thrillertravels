"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
function statusMessage(statusCode) {
    switch (statusCode) {
        case 400:
            return 'Bad Request';
        case 401:
            return 'Unauthorized';
        case 402:
            return 'Payment Required';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not Found';
        case 405:
            return 'Method Not Allowed';
        case 406:
            return 'Not Acceptable';
        case 408:
            return 'Request Timeout';
        case 409:
            return 'Conflict';
        default:
            return 'Internal Server Error';
    }
}
let GenericExceptionFilter = class GenericExceptionFilter extends core_1.BaseExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        let status;
        if (isNaN(exception?.status) ||
            !Number.isInteger(exception?.status) ||
            exception?.status < 100 ||
            exception?.status > 599) {
            status = 500;
        }
        else {
            status = exception?.status;
        }
        response.status(status).json({
            status: false,
            statusCode: status,
            message: exception?.response?.message ||
                exception?.message ||
                'Internal Server Error',
            error: exception?.response?.error || statusMessage(exception?.status),
        });
        return null;
    }
};
exports.GenericExceptionFilter = GenericExceptionFilter;
exports.GenericExceptionFilter = GenericExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GenericExceptionFilter);
//# sourceMappingURL=filters.js.map