import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

const DEFAULT_ROTATION = { x: 0, y: 0, z: 0, w: 1 };

// ── 型定義 ──

export interface PlayerBody {
  playerId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

interface RawBody {
  playerId: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number; w: number };
}

export interface WorldObjectData {
  instanceId: number;
  objectId: number;
  position: { x: number; y: number; z: number };
  destroyed: boolean;
  isDropped: boolean;
}

export interface AreaData {
  id: string;
  col: number;
  row: number;
  center: { x: number; y: number; z: number };
  size: number;
  worldObjects: WorldObjectData[];
}

export interface StageObjectData {
  id: string;
  position: [number, number, number];
  halfExtents: [number, number, number];
  destroyed: boolean;
}

export interface StageData {
  areas: AreaData[];
  objects: StageObjectData[];
}

// ── ヘルパー ──

function normalizeBody(raw: RawBody): PlayerBody {
  return {
    ...raw,
    rotation: raw.rotation ?? DEFAULT_ROTATION,
  };
}

// ── Hook ──

export interface InventoryItem {
  id: number;
  name: string;
  number: number;
}

export interface WorkResult {
  success: boolean;
  message: string;
}

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [bodies, setBodies] = useState<PlayerBody[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [stage, setStage] = useState<StageData | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lastWorkResult, setLastWorkResult] = useState<WorkResult | null>(null);

  useEffect(() => {
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit(
        "room:join",
        { roomId },
        (res: {
          ok: boolean;
          position: { x: number; y: number; z: number };
          stage: StageData;
          inventory?: InventoryItem[];
        }) => {
          setMyId(socket.id ?? null);
          setStage(res.stage);
          if (res.inventory) setInventory(res.inventory);
        },
      );
    });

    socket.on("physics:state", ({ bodies }: { bodies: RawBody[] }) => {
      setBodies(bodies.map(normalizeBody));
    });

    socket.on("player:joined", (data: RawBody) => {
      setBodies((prev) => {
        if (prev.find((b) => b.playerId === data.playerId)) return prev;
        return [...prev, normalizeBody(data)];
      });
    });

    socket.on("player:left", ({ playerId }: { playerId: string }) => {
      setBodies((prev) => prev.filter((b) => b.playerId !== playerId));
    });

    // StageObjectが破壊された時の更新
    socket.on(
      "stage:object:destroyed",
      ({ objectId }: { objectId: string }) => {
        setStage((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            objects: prev.objects.map((obj) =>
              obj.id === objectId ? { ...obj, destroyed: true } : obj,
            ),
          };
        });
      },
    );

    // WorldObjectが新規追加された時の更新
    socket.on(
      "worldobject:spawned",
      ({
        areaId,
        worldObject,
      }: {
        areaId: string;
        worldObject: WorldObjectData;
      }) => {
        setStage((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            areas: prev.areas.map((area) =>
              area.id === areaId
                ? { ...area, worldObjects: [...area.worldObjects, worldObject] }
                : area,
            ),
          };
        });
      },
    );

    // WorldObjectが破壊された時の更新
    socket.on(
      "worldobject:destroyed",
      ({ instanceId }: { instanceId: number }) => {
        setStage((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            areas: prev.areas.map((area) => ({
              ...area,
              worldObjects: area.worldObjects.map((wo) =>
                wo.instanceId === instanceId ? { ...wo, destroyed: true } : wo,
              ),
            })),
          };
        });
      },
    );

    // 作業結果
    socket.on("work:result", (data: WorkResult) => {
      setLastWorkResult(data);
    });

    // インベントリ更新
    socket.on(
      "inventory:update",
      (data: { items: InventoryItem[] }) => {
        setInventory(data.items);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendInput = useCallback(
    (message: { eventName: string; content: Record<string, unknown> }) => {
      socketRef.current?.emit("player:input", { roomId, message });
    },
    [roomId],
  );

  return { bodies, myId, stage, sendInput, inventory, lastWorkResult };
}
