import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Color, GameRoomStatus } from 'src/types';

export type GameRoomDocument = GameRoom & Document;

@Schema()
export class GameRoom {
  @Prop({ required: true })
  id: string;

  @Prop([String])
  players: string[];

  @Prop({
    type: Number,
    enum: [0, 1],
    default: 0,
  })
  currentPlayerIndex: number;

  @Prop({
    type: String,
    enum: Object.values(GameRoomStatus),
    default: 'pending',
  })
  status: string;

  @Prop({ type: String, enum: Object.values(Color) })
  winner: string;

  @Prop({ required: true })
  boardId: string;
}

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);
