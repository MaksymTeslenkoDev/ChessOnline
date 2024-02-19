import { Injectable } from '@nestjs/common';
import { generateUID } from 'src/helpers';
import { BoardRepository } from 'src/repositories/board.repository';
import { GameRoomRepository } from 'src/repositories/gameRoom.repository';
import { Move } from 'src/types';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private gameRoomRepository: GameRoomRepository,
  ) {}

  async create() {
    try {
      const id = generateUID();
      const board = await this.boardRepository.create({
        id,
      });
      return {
        status: 'success',
        message: 'Board created',
        data: { board },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }

  async addMove(boardId: string, move: Move) {
    try {
      const board = await this.boardRepository.findOne(boardId);
      if (!board) {
        return {
          status: 'error',
          message: 'Board not found',
        };
      }
      board.moves = [move, ...board.moves];
      await this.boardRepository.update(boardId, { moves: board.moves });
      const gameRoom =
        await this.gameRoomRepository.findOneWithBoardByBoardId(boardId);
      return {
        status: 'success',
        message: 'Move added',
        data: { board, gameRoom },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }

  async deleteMoves(boardId: string) {
    try {
      const board = await this.boardRepository.findOne(boardId);
      if (!board) {
        return {
          status: 'error',
          message: 'Board not found',
        };
      }
      board.moves = [];
      await this.boardRepository.update(boardId, { moves: board.moves });
      return {
        status: 'success',
        message: 'Moves deleted',
        data: { board },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }
  async deleteBoard(id: string) {
    await this.boardRepository.delete(id);
  }
}
