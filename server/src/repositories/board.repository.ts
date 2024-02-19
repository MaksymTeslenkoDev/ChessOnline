import { Board, BoardDocument } from 'src/schemas/Board';
import { CrudRepository } from './crud';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardRepository extends CrudRepository<BoardDocument> {
  constructor(@InjectModel(Board.name) boardModel: Model<BoardDocument>) {
    super(boardModel);
  }
}
