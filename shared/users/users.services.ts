import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddUserDto, UpdateProfileDto } from './users.dto';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async addUser(addUserDto: AddUserDto) {
    return await this.userModel.create(addUserDto);
  }
  async findUser(field: string, key: string): Promise<User | null | undefined> {
    return await this.userModel.findOne({ [field]: key }, {}, { lean: true });
  }

  async updateField(
    foo: string,
    bar: string,
    field: string,
    key: string | boolean,
  ): Promise<User | null | undefined> {
    return await this.userModel.findOneAndUpdate(
      { [foo]: bar },
      { [field]: key },
      { lean: true, new: true },
    );
  }
  async getAllUsers() {
    return await this.userModel.find();
  }

  async getCredential(foo: string, bar: string): Promise<Partial<User | null>> {
    return await this.userModel.findOne(
      { [foo]: bar },
      {
        password: 1,
        userId: 1,
        email: 1,
        emailVerified: 1,
        phone: 1,
        phoneVerified: 1,
      },
    );
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return await this.userModel.findOneAndUpdate({ userId }, updateProfileDto, {
      new: true,
      lean: true,
    });
  }
}
