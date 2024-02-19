import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Client } from 'ws';
import { UserService } from './services/user.service';
import { BoardService } from './services/board.service';
import { GameRoomService } from './services/gameRoom.service';

interface ChessGatewayTopics {
  readonly user: UserService;
  readonly board: BoardService;
  readonly gameRoom: GameRoomService;
}

@WebSocketGateway()
export class ChessGateway implements ChessGatewayTopics, OnGatewayConnection {
  private connections = new Map<string, WebSocket>();

  // Gateways topics
  readonly user: UserService;
  readonly board: BoardService;
  readonly gameRoom: GameRoomService;

  constructor(
    userService: UserService,
    boardService: BoardService,
    gameRoomService: GameRoomService,
  ) {
    this.user = userService;
    this.board = boardService;
    this.gameRoom = gameRoomService;
  }

  async handleConnection(client: Client, ...args: any[]) {
    const ip = args[0].socket.remoteAddress;
    client.on('message', async (message) => {
      const { name, method, args = [] } = JSON.parse(message);
      const entity = this[name];
      if (!entity) {
        client.send('"Not found"', { binary: false });
        return;
      }
      const handler = entity[method];
      if (!handler) {
        client.send('"Not found"', { binary: false });
        return;
      }
      const boundHandler = handler.bind(entity);
      const json = JSON.stringify(args);
      const parameters = json.substring(1, json.length - 1);
      console.log(`${ip} ${name}.${method}(${parameters})`);
      try {
        const res = await boundHandler(...args);
        client.send(JSON.stringify({ event: method, ...res }));
        if (method === 'connect' && res.status === 'success') {
          this.connections.set(res.data.user.id, client);
          return;
        }
        if (method === 'join' && res.status === 'success') {
          for (const player of res.data.gameRoom.players) {
            const playerConnection = this.connections.get(player);
            if (playerConnection) {
              playerConnection.send(JSON.stringify({ event: 'join', ...res }));
            }
          }
          return;
        }
        if (method === 'addMove' && res.status === 'success') {
          for (const player of res.data.gameRoom.players) {
            const playerConnection = this.connections.get(player);
            if (playerConnection) {
              playerConnection.send(JSON.stringify({ event: 'move', ...res }));
            }
          }
          return;
        }
        if (method === 'leave' && res.status === 'success') {
          for (const player of res.data.gameRoom.players) {
            const playerConnection = this.connections.get(player);
            if (playerConnection) {
              playerConnection.send(JSON.stringify({ event: 'leave', ...res }));
            }
          }
          return;
        }
      } catch (e) {
        console.error(e);
        client.send('"Server error"', { binary: false });
      }
    });
    client.on('close', async () => {
      for (const [userId, connection] of this.connections) {
        if (connection === client) {
          this.connections.delete(userId);

          const resGames = await this.gameRoom.getPlayersGames(userId);
          const games = resGames.data.gameRooms;
          for (const game of games) {
            const opponentId = game.players.filter((id) => id !== userId)[0];
            const opponentConnection = this.connections.get(opponentId);
            const res = await this.gameRoom.leave(game.id, userId);

            if (
              res.status === 'success' &&
              // @ts-ignore
              res.data.gameRoom &&
              opponentConnection
            ) {
              opponentConnection.send(
                JSON.stringify({
                  event: 'leave',
                  status: 'success',
                  message: 'Opponent left',
                  // @ts-ignore
                  data: { gameRoom: res.data.gameRoom },
                }),
              );
            }
          }
          break;
        }
      }
    });
  }
}
