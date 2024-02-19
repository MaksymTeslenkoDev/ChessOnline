import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChessGateway } from './chess.gateway';
import { GameRoom, GameRoomSchema } from './schemas/GameRoom';
import { User, UserSchema } from './schemas/User';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { BoardService } from './services/board.service';
import { BoardRepository } from './repositories/board.repository';
import { GameRoomRepository } from './repositories/gameRoom.repository';
import { GameRoomService } from './services/gameRoom.service';
import { Board, BoardSchema } from './schemas/Board';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/chess'),
    MongooseModule.forFeature([
      { name: GameRoom.name, schema: GameRoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Board.name, schema: BoardSchema },
    ]),
  ],
  controllers: [],
  providers: [
    UserService,
    UserRepository,
    BoardService,
    BoardRepository,
    GameRoomRepository,
    GameRoomService,
    ChessGateway,
  ],
})
export class AppModule {}
