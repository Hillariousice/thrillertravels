export declare class TokenHandler {
    static hashKey(key: string): Promise<any>;
    static verifyKey(hash: string, plain: string): Promise<any>;
}
