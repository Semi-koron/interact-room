import { useCallback, useEffect, useRef } from "react";
import type { WorldObjectData } from "../hooks/useSocket";
import { OBJECT_DEFS } from "../data/Object/index";

const TICK_MS = 100;

interface Props {
  sendInput: (message: {
    eventName: string;
    content: Record<string, unknown>;
  }) => void;
  playerPos: { x: number; z: number } | null;
  worldObjects: WorldObjectData[];
  processSelections: Record<number, number>;
}

/** プレイヤーのReach範囲内にある最も近いWorldObjectを返す */
function findNearestInRange(
  playerPos: { x: number; z: number },
  worldObjects: WorldObjectData[],
): {
  obj: WorldObjectData;
  def: {
    name: string;
    id: number;
    reach: number;
    processes: {
      consumeItemIds: number[];
      getItemIds: number[];
      requireItemIds: number[];
      workload: number;
    }[];
  };
} | null {
  let best: {
    obj: WorldObjectData;
    dist: number;
    def: NonNullable<ReturnType<typeof OBJECT_DEFS.get>>;
  } | null = null;

  for (const wo of worldObjects) {
    if (wo.destroyed) continue;
    const def = OBJECT_DEFS.get(wo.objectId);
    if (!def) continue;
    const dx = playerPos.x - wo.position.x;
    const dz = playerPos.z - wo.position.z;
    const dist = dx * dx + dz * dz;
    if (dist <= def.reach * def.reach) {
      if (!best || dist < best.dist) {
        best = { obj: wo, dist, def };
      }
    }
  }

  return best ? { obj: best.obj, def: best.def } : null;
}

export function InteractButton({
  sendInput,
  playerPos,
  worldObjects,
  processSelections,
}: Props) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetRef = useRef<{ instanceId: number; processIndex: number } | null>(
    null,
  );

  const nearest = playerPos
    ? findNearestInRange(playerPos, worldObjects)
    : null;

  const canInteract = nearest !== null;

  const startWork = useCallback(() => {
    if (!nearest) return;
    const processIndex = processSelections[nearest.obj.instanceId] ?? 0;
    const payload = { instanceId: nearest.obj.instanceId, processIndex };
    targetRef.current = payload;

    // 即座に1回送信
    sendInput({ eventName: "work", content: payload });

    // 毎tick送信
    intervalRef.current = setInterval(() => {
      if (targetRef.current) {
        sendInput({ eventName: "work", content: targetRef.current });
      }
    }, TICK_MS);
  }, [nearest, sendInput, processSelections]);

  const stopWork = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (targetRef.current) {
      targetRef.current = null;
      sendInput({ eventName: "work:cancel", content: {} });
    }
  }, [sendInput]);

  // 範囲外に出たら自動キャンセル
  useEffect(() => {
    if (!canInteract && targetRef.current) {
      stopWork();
    }
  }, [canInteract, stopWork]);

  // アンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 10,
        touchAction: "none",
      }}
    >
      <button
        type="button"
        onPointerDown={canInteract ? startWork : undefined}
        onPointerUp={stopWork}
        onPointerLeave={stopWork}
        disabled={!canInteract}
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "none",
          fontSize: 16,
          fontWeight: "bold",
          color: "#fff",
          background: canInteract
            ? "rgba(255, 165, 0, 0.8)"
            : "rgba(128, 128, 128, 0.3)",
          cursor: canInteract ? "pointer" : "default",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          transition: "background 0.2s",
        } as React.CSSProperties}
      >
        {canInteract ? nearest!.def.name : "---"}
      </button>
    </div>
  );
}
