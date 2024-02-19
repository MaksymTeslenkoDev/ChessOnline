import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Color, Figure, Move } from 'src/types';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
  @Prop({ required: true })
  id: string;

  @Prop([
    {
      color: { type: String, enum: Object.values(Color) },
      index: { type: Number },
      figure: {
        type: String,
        enum: Object.values(Figure),
      },
      targetCell: [Number],
      rookIndex: { type: Number, optional: true },
      rookTargetCell: { type: [Number], optional: true },
    },
  ])
  moves: Array<Move>;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
