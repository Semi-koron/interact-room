import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";
const ROOM_ID = "room-A";

export interface Body {
  playerId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

export interface PhysicsState {
  roomId: string;
  bodies: Body[];
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [bodies, setBodies] = useState<Body[]>([]);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit(
        "room:join",
        { roomId: ROOM_ID },
        (res: {
          playerId: string;
          position: { x: number; y: number; z: number };
        }) => {
          setMyId(res.playerId);
        },
      );
    });

    socket.on("physics:state", ({ bodies }: PhysicsState) => {
      setBodies(bodies);
    });

    socket.on("player:joined", (data: Body) => {
      setBodies((prev) => {
        if (prev.find((b) => b.playerId === data.playerId)) return prev;
        return [...prev, data];
      });
    });

    socket.on("player:left", ({ playerId }: { playerId: string }) => {
      setBodies((prev) => prev.filter((b) => b.playerId !== playerId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendInput = useCallback(
    (message: { eventName: string; content: Record<string, unknown> }) => {
      socketRef.current?.emit("player:input", { roomId: ROOM_ID, message });
    },
    [],
  );

  return { bodies, myId, sendInput };
}
