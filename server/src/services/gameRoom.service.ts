import { Injectable } from '@nestjs/common';
import { generateUID } from 'src/helpers';
import { GameRoomRepository } from 'src/repositories/gameRoom.repository';
import { BoardService } from './board.service';
import { Color, GameRoomStatus } from 'src/types';

@Injectable()
export class GameRoomService {
  constructor(
    private gameRoomRepository: GameRoomRepository,
    private boardService: BoardService,
  ) {}

  async create() {
    try {
      const roomId = generateUID();
      const boardEntity = await this.boardService.create();
      if (!boardEntity.data) return boardEntity;
      const gameRoom = await this.gameRoomRepository.create({
        id: roomId,
        boardId: boardEntity.data.board.id,
        players: [],
      });

      if (!gameRoom) {
        await this.boardService.deleteBoard(boardEntity.data.board.id);
        return {
          status: 'error',
          message: 'Failed to create game room',
        };
      }
      return {
        status: 'success',
        message: 'Game room created',
        data: {
          gameRoom: { ...gameRoom['_doc'], board: boardEntity.data.board },
        },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }

  async join(roomId: string, userId: string) {
    try {
      const gameRoom = await this.gameRoomRepository.findOneWithBoard(roomId);
      if (!gameRoom) {
        return {
          status: 'error',
          message: 'Game room not found',
        };
      }
      if (gameRoom.players.includes(userId)) {
        return {
          status: 'success',
          message: 'Joined game room',
          data: { gameRoom },
        };
      }

      if (gameRoom.players.length >= 2) {
        return {
          status: 'error',
          message: 'Game room is full',
        };
      }
      gameRoom.players.push(userId);
      gameRoom.status =
        gameRoom.players.length === 2
          ? GameRoomStatus.InProcess
          : GameRoomStatus.Pending;
      await this.gameRoomRepository.update(roomId, gameRoom);
      return {
        status: 'success',
        message: 'Joined game room',
        data: { gameRoom },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }

  async finishGame(roomId: string, winner: Color) {
    try {
      const gameRoom = await this.gameRoomRepository.findOneWithBoard(roomId);
      if (!gameRoom) {
        return {
          status: 'error',
          message: 'Game room not found',
        };
      }
      gameRoom.status = GameRoomStatus.Finished;
      gameRoom.winner = winner;
      await this.gameRoomRepository.update(roomId, gameRoom);
      return {
        status: 'success',
        message: 'Game room finished',
        data: { gameRoom },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }

  async leave(roomId: string, userId: string) {
    try {
      const gameRoom = await this.gameRoomRepository.findOneWithBoard(roomId);
      if (!gameRoom) {
        return {
          status: 'error',
          message: 'Game room not found',
        };
      }
      gameRoom.players = gameRoom.players.filter((player) => player !== userId);
      gameRoom.board.moves = [];
      const res = await this.boardService.deleteMoves(gameRoom.boardId);
      if (res.status === 'error') return res;
      await this.gameRoomRepository.update(roomId, gameRoom);
      return {
        status: 'success',
        message: 'Left game room',
        data: { gameRoom },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }

  async getPlayersGames(userId: string) {
    try {
      const gameRooms =
        await this.gameRoomRepository.getAllGamesOfPlayer(userId);
      return {
        status: 'success',
        message: 'Games found',
        data: { gameRooms },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }
}
