import { useMemo } from "react";
import type { WorldObjectData } from "../hooks/useSocket";
import { OBJECT_DEFS } from "../data/Object/index";
import { ITEM_DEFS } from "../data/Items/index";

interface Props {
  playerPos: { x: number; z: number } | null;
  worldObjects: WorldObjectData[];
  processSelections: Record<number, number>;
  onProcessChange: (instanceId: number, processIndex: number) => void;
}

function itemNames(ids: number[]): string {
  return ids
    .map((id) => ITEM_DEFS.get(id)?.name ?? `#${id}`)
    .join(", ");
}

export function ProcessSwitcher({
  playerPos,
  worldObjects,
  processSelections,
  onProcessChange,
}: Props) {
  const nearest = useMemo(() => {
    if (!playerPos) return null;
    let best: { obj: WorldObjectData; dist: number } | null = null;

    for (const wo of worldObjects) {
      if (wo.destroyed || wo.isDropped) continue;
      const def = OBJECT_DEFS.get(wo.objectId);
      if (!def || def.processes.length <= 1) continue;
      const dx = playerPos.x - wo.position.x;
      const dz = playerPos.z - wo.position.z;
      const dist = dx * dx + dz * dz;
      if (dist <= def.reach * def.reach) {
        if (!best || dist < best.dist) {
          best = { obj: wo, dist };
        }
      }
    }
    return best?.obj ?? null;
  }, [playerPos, worldObjects]);

  if (!nearest) return null;

  const def = OBJECT_DEFS.get(nearest.objectId);
  if (!def || def.processes.length <= 1) return null;

  const processes = def.processes;
  const currentIdx = Math.min(
    processSelections[nearest.instanceId] ?? 0,
    processes.length - 1,
  );

  const prev = () =>
    onProcessChange(
      nearest.instanceId,
      (currentIdx - 1 + processes.length) % processes.length,
    );
  const next = () =>
    onProcessChange(
      nearest.instanceId,
      (currentIdx + 1) % processes.length,
    );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        padding: "12px 16px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 500,
          pointerEvents: "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        } as React.CSSProperties}
      >
        <span style={{ fontSize: 12, color: "#aaa", marginRight: 4 }}>
          {def.name}
        </span>
        <button
          type="button"
          onClick={prev}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "#fff",
            fontSize: 18,
            width: 36,
            height: 36,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ◀
        </button>
        <span style={{ minWidth: 80, textAlign: "center" }}>
          {itemNames(processes[currentIdx].getItemIds)}
        </span>
        <button
          type="button"
          onClick={next}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "#fff",
            fontSize: 18,
            width: 36,
            height: 36,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ▶
        </button>
        <span style={{ fontSize: 11, color: "#888" }}>
          {currentIdx + 1}/{processes.length}
        </span>
      </div>
    </div>
  );
}
