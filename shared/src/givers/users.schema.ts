import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import { File } from '../common/dtos';
import { KeyGen } from '../common/utils/key-gen';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ unique: true, default: () => `US${KeyGen.gen(13)}` })
  userId: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop()
  username: string;

  @Prop({ type: Date })
  dob: Date;

  @Prop()
  gender: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  country: string;

  @Prop({ select: false })
  password: string;

  @Prop({ boolean: true, default: false })
  emailVerified: boolean;

  @Prop({ boolean: true, default: false })
  phoneVerified: boolean;

  @Prop({ default: null })
  photo: File;
}

export const UserSchema = SchemaFactory.createForClass(User);
