import { useRouter } from "next/router";
import { useWebSocket } from "@/providers";

export default function Index() {
  const router = useRouter();
  const { api, user, handleUpdateGameRoom } = useWebSocket();

  const createGame = async () => {
    if (api && user?.id) {
      const { data, status } = await api.gameRoom.create();
      if (status === "success" && data) {
        router.push(`/${data.gameRoom.id}`);
        handleUpdateGameRoom(data.gameRoom);
      }
    }
  };

  return (
    <div className="wrapper">
      <button onClick={createGame}>Create a game</button>
    </div>
  );
}
