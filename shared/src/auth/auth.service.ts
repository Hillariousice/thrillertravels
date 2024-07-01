import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../givers/users.schema'; // Ensure this points to the Mongoose schema
import { UserDetails } from '../common/dtos';
import { EmailVerifDocument, TokenVerif } from './token-verif.schema';
import {
  AddTokenVerifParams,
  DeleteEmailTokenParams,
  GetTokenParams,
  UpdateTokenVerifParams,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TokenVerif.name)
    private readonly emailVerifModel: Model<EmailVerifDocument>,
  ) {}

  async validateUser(details: UserDetails): Promise<User> {
    console.log('AuthService');
    console.log(details);
    const user = await this.userModel.findOne({ email: details.email }).exec();
    console.log(user);
    if (user) {
      return user;
    }
    console.log('User not found. Creating...');
    const newUser = new this.userModel(details);
    await newUser.save();
    return newUser;
  }

  async findUser(id: number): Promise<User> {
    return await this.userModel.findById(id).exec();
  }
  async addEmailToken(
    addEmailVerifParams: AddTokenVerifParams,
  ): Promise<TokenVerif> {
    return await this.emailVerifModel.create(addEmailVerifParams);
  }

  async getVerifToken({
    medium,
    target,
    usage,
  }: GetTokenParams): Promise<TokenVerif | null> {
    return await this.emailVerifModel.findOne({
      target,
      usage,
      medium,
    });
  }

  async updateVerifToken({
    target,
    usage,
    medium,
    tokenHash,
  }: UpdateTokenVerifParams): Promise<TokenVerif | null> {
    return await this.emailVerifModel.findOneAndUpdate(
      { medium, target, usage },
      { tokenHash: tokenHash },
      { new: true },
    );
  }

  async deleteEmailTokens({
    medium,
    target,
    usage,
  }: DeleteEmailTokenParams): Promise<any> {
    return await this.emailVerifModel.deleteMany({ target, medium, usage });
  }
}
