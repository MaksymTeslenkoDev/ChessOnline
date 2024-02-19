import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrudRepository } from './crud';
import { GameRoom, GameRoomDocument } from 'src/schemas/GameRoom';

@Injectable()
export class GameRoomRepository extends CrudRepository<GameRoomDocument> {
  private gameRoomModel: Model<GameRoomDocument>;
  constructor(
    @InjectModel(GameRoom.name) gameRoomModel: Model<GameRoomDocument>,
  ) {
    super(gameRoomModel);
    this.gameRoomModel = gameRoomModel;
  }

  async findOneWithBoard(roomId: string) {
    const result = await this.gameRoomModel.aggregate([
      {
        $match: {
          id: roomId,
        },
      },
      {
        $lookup: {
          from: 'boards',
          localField: 'boardId',
          foreignField: 'id',
          as: 'board',
        },
      },
      {
        $unwind: '$board',
      },
    ]);

    return result[0];
  }
  async findOneWithBoardByBoardId(boardId: string) {
    const result = await this.gameRoomModel.aggregate([
      {
        $match: {
          boardId,
        },
      },
      {
        $lookup: {
          from: 'boards',
          localField: 'boardId',
          foreignField: 'id',
          as: 'board',
        },
      },
      {
        $unwind: '$board',
      },
    ]);

    return result[0];
  }

  async getAllGamesOfPlayer(userId: string) {
    const gameRooms = await this.gameRoomModel.find({ players: userId });
    return gameRooms;
  }
}
