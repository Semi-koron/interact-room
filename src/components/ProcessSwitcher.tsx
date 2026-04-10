import { useMemo } from "react";
import type { WorldObjectData, WorkResult } from "../hooks/useSocket";
import { OBJECT_DEFS } from "../data/Object/index";
import { ITEM_DEFS } from "../data/Items/index";
import { getProcessImage, ITEM_IMAGE } from "../data/itemImages";

interface Props {
  playerPos: { x: number; z: number } | null;
  worldObjects: WorldObjectData[];
  processSelections: Record<number, number>;
  onProcessChange: (instanceId: number, processIndex: number) => void;
  workResult?: WorkResult | null;
}

function itemName(ids: number[]): string {
  return ids.map((id) => ITEM_DEFS.get(id)?.name ?? `#${id}`).join(", ");
}

export function ProcessSwitcher({
  playerPos,
  worldObjects,
  processSelections,
  onProcessChange,
  workResult,
}: Props) {
  const nearest = useMemo(() => {
    if (!playerPos) return null;
    let best: { obj: WorldObjectData; dist: number } | null = null;

    for (const wo of worldObjects) {
      if (wo.destroyed || wo.isDropped) continue;
      const def = OBJECT_DEFS.get(wo.objectId);
      if (!def) continue;
      // processが1つかつrequireItemIdsも空なら表示不要
      const hasMultiProcess = def.processes.length > 1;
      const hasRequire = def.processes.some((p) => p.requireItemIds.length > 0);
      if (!hasMultiProcess && !hasRequire) continue;
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
  if (!def) return null;

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
    onProcessChange(nearest.instanceId, (currentIdx + 1) % processes.length);

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
        style={
          {
            display: "flex",
            flexDirection: "column",
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
          } as React.CSSProperties
        }
      >
        {/* 上段: レシピ画像 */}
        {(() => {
          const p = processes[currentIdx];
          const img = getProcessImage(
            p.getItemIds,
            p.consumeItemIds,
            p.requireItemIds,
          );
          return img ? (
            <img
              src={img}
              alt={itemName(p.getItemIds)}
              style={
                img.includes("/recipe/")
                  ? {
                      width: "auto",
                      height: "auto",
                      maxWidth: "80vw",
                      maxHeight: "100px",
                    }
                  : { width: 48, height: 48, objectFit: "contain" }
              }
            />
          ) : null;
        })()}

        {/* 下段: ◀ アイテム名 ▶ + カウンター */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>{def.name}</span>
          {processes.length > 1 && (
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
          )}
          <span style={{ minWidth: 80, textAlign: "center", fontSize: 13 }}>
            {itemName(processes[currentIdx].getItemIds)}
          </span>
          {processes.length > 1 && (
            <>
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
            </>
          )}
        </div>

        {/* 必要ツール */}
        {(() => {
          const uniqueRequires = [
            ...new Set(processes[currentIdx].requireItemIds),
          ];
          if (uniqueRequires.length === 0) return null;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,200,0,0.15)",
                border: "1px solid rgba(255,200,0,0.4)",
                borderRadius: 6,
                padding: "2px 6px",
              }}
            >
              <span style={{ fontSize: 10, color: "#ffd060" }}>必要</span>
              {uniqueRequires.map((id) => {
                const toolImg = ITEM_IMAGE[id];
                const name = ITEM_DEFS.get(id)?.name ?? `#${id}`;
                return (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {toolImg && (
                      <img
                        src={toolImg}
                        alt={name}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                    )}
                    <span style={{ fontSize: 9, color: "#ffd060" }}>
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* プログレスバー */}
        {workResult &&
          workResult.progress != null &&
          workResult.workload != null &&
          workResult.workload > 0 && (
            <div style={{ width: "100%", minWidth: 160 }}>
              <div
                style={{
                  width: "100%",
                  height: 8,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (workResult.progress / workResult.workload) * 100)}%`,
                    height: "100%",
                    background: "#4caf50",
                    borderRadius: 4,
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: 10,
                  color: "#aaa",
                  marginTop: 2,
                }}
              >
                {workResult.progress} / {workResult.workload}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
