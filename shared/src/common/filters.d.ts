import { ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
export declare class GenericExceptionFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any;
}
