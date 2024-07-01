/// <reference types="node_modules/mongoose/types/aggregate" />
/// <reference types="node_modules/mongoose/types/callback" />
/// <reference types="node_modules/mongoose/types/collection" />
/// <reference types="node_modules/mongoose/types/connection" />
/// <reference types="node_modules/mongoose/types/cursor" />
/// <reference types="node_modules/mongoose/types/document" />
/// <reference types="node_modules/mongoose/types/error" />
/// <reference types="node_modules/mongoose/types/expressions" />
/// <reference types="node_modules/mongoose/types/helpers" />
/// <reference types="node_modules/mongoose/types/middlewares" />
/// <reference types="node_modules/mongoose/types/indexes" />
/// <reference types="node_modules/mongoose/types/models" />
/// <reference types="node_modules/mongoose/types/mongooseoptions" />
/// <reference types="node_modules/mongoose/types/pipelinestage" />
/// <reference types="node_modules/mongoose/types/populate" />
/// <reference types="node_modules/mongoose/types/query" />
/// <reference types="node_modules/mongoose/types/schemaoptions" />
/// <reference types="node_modules/mongoose/types/schematypes" />
/// <reference types="node_modules/mongoose/types/session" />
/// <reference types="node_modules/mongoose/types/types" />
/// <reference types="node_modules/mongoose/types/utility" />
/// <reference types="node_modules/mongoose/types/validation" />
/// <reference types="node_modules/mongoose/types/virtuals" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="node_modules/mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
import { TokenMedium, TokenVerifUsage } from './auth.enum';
export type EmailVerifDocument = TokenVerif & Document;
export declare class TokenVerif {
    target: string;
    medium: TokenMedium;
    tokenHash: string;
    usage: TokenVerifUsage;
}
declare const EmailVerifSchema: import("mongoose").Schema<TokenVerif, import("mongoose").Model<TokenVerif, any, any, any, Document<unknown, any, TokenVerif> & TokenVerif & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TokenVerif, Document<unknown, {}, import("mongoose").FlatRecord<TokenVerif>> & import("mongoose").FlatRecord<TokenVerif> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export { EmailVerifSchema };
