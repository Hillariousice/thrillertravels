import argon2 from 'argon2';

export class TokenHandler {
  static async hashKey(key: string): Promise<any> {
    try {
      return await argon2.hash(key);
    } catch (error) {
      /* istanbul ignore next */
      console.error(error);
    }
  }

  static async verifyKey(hash: string, plain: string): Promise<any> {
    try {
      return await argon2.verify(hash, plain);
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
    }
  }
}
