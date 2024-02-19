import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ default: null })
  name: string;

  @Prop({ default: 0 })
  won: number;

  @Prop({ default: 0 })
  lost: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
