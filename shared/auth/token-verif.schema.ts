import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TokenMedium, TokenVerifUsage } from './auth.enum';

export type EmailVerifDocument = TokenVerif & Document;

@Schema({ timestamps: true })
export class TokenVerif {
  @Prop({ required: true })
  target: string;

  @Prop({ required: true, enum: TokenMedium })
  medium: TokenMedium;

  @Prop({ required: true })
  tokenHash: string;

  @Prop({ required: true, enum: TokenVerifUsage })
  usage: TokenVerifUsage;
}

const EmailVerifSchema = SchemaFactory.createForClass(TokenVerif);

export { EmailVerifSchema };
