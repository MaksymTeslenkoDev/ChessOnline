import { Colors, GameRoom } from "./types";

export function generateUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getColorOfMoove(userId: string, players: string[]) {
  const IndexColorMap = [Colors.WHITE, Colors.BLACK];

  const userIndex = players.findIndex((value) => value === userId);
  return IndexColorMap[userIndex];
}

export function isSecondPlayerOnline(gameRoom: GameRoom, color: Colors) {
  const playerId =
    color === Colors.WHITE ? gameRoom.players[0] : gameRoom.players[1];
  if (playerId) {
    return gameRoom.players.filter((player) => player !== playerId).length > 0;
  }
}

export function deepCopyWithoutCircularReferences(object: any) {
  const seen = new WeakSet();

  function deepCopy(obj: any) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    if (seen.has(obj)) {
      return;
    }
    seen.add(obj);

    let copy = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      // @ts-ignore
      copy[key] = deepCopy(obj[key]);
    }

    return copy;
  }

  return deepCopy(object);
}
