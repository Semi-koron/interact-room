import { Html, Outlines } from "@react-three/drei";
import type { StageData, WorldObjectData } from "../../../hooks/useSocket";
import { OBJECT_DEFS } from "../../../data/Object/index";
import { ITEM_DEFS } from "../../../data/Items/index";

/** 地面 */
function Ground({ size }: { size: number }) {
  return (
    <mesh position={[0, -0.1, 0]} receiveShadow>
      <boxGeometry args={[size, 0.2, size]} />
      <meshStandardMaterial color="#4a7c59" />
    </mesh>
  );
}

/** エリアの境界線 (デバッグ用、任意) */
function AreaGrid({ areas }: { areas: StageData["areas"] }) {
  return (
    <>
      {areas.map((area) => (
        <mesh key={area.id} position={[area.center.x, 0.01, area.center.z]}>
          <planeGeometry args={[area.size, area.size]} />
          <meshStandardMaterial
            color="#5a8c69"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
}

/** 川(壁)オブジェクト */
function River({ object }: { object: StageData["objects"][number] }) {
  if (object.destroyed) return null;

  const [hx, hy, hz] = object.halfExtents;

  return (
    <mesh position={object.position} castShadow receiveShadow>
      <boxGeometry args={[hx * 2, hy * 2, hz * 2]} />
      <meshStandardMaterial color="#3a8bcd" transparent opacity={0.7} />
    </mesh>
  );
}

/** getItemIds からアイテム名を解決 */
function itemNames(ids: number[]): string {
  return ids
    .map((id) => ITEM_DEFS.get(id)?.name ?? `#${id}`)
    .join(", ");
}

/** WorldObject マーカー */
function WorldObjectMarker({
  obj,
  playerPos,
  selectedProcess,
  onProcessChange,
}: {
  obj: WorldObjectData;
  playerPos: { x: number; z: number } | null;
  selectedProcess: number;
  onProcessChange: (objectId: number, processIndex: number) => void;
}) {
  const def = OBJECT_DEFS.get(obj.id);
  const reach = def?.reach ?? 3;
  const processes = def?.processes ?? [];

  const inRange = (() => {
    if (!playerPos) return false;
    const dx = playerPos.x - obj.position.x;
    const dz = playerPos.z - obj.position.z;
    return dx * dx + dz * dz <= reach * reach;
  })();

  const currentIdx = Math.min(selectedProcess, processes.length - 1);

  return (
    <group position={[obj.position.x, 0, obj.position.z]}>
      {/* 本体 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
        <meshStandardMaterial color="#d4a030" />
        {inRange && <Outlines thickness={10} color="yellow" />}
      </mesh>
      {/* 上に浮かぶID表示用の小さな球 */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color="#ff6644"
          emissive="#ff6644"
          emissiveIntensity={0.5}
        />
        {inRange && <Outlines thickness={10} color="yellow" />}
      </mesh>

      {/* インタラクト可能時のプロセス選択UI */}
      {inRange && processes.length > 0 && (
        <Html position={[0, 2.2, 0]} center distanceFactor={10}>
          <div
            style={{
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 13,
              whiteSpace: "nowrap",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {processes.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  onProcessChange(
                    obj.id,
                    (currentIdx - 1 + processes.length) % processes.length,
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                  padding: "0 2px",
                }}
              >
                ◀
              </button>
            )}
            <span>{itemNames(processes[currentIdx].getItemIds)}</span>
            {processes.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  onProcessChange(
                    obj.id,
                    (currentIdx + 1) % processes.length,
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                  padding: "0 2px",
                }}
              >
                ▶
              </button>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

/** ステージ全体 */
export function StageRenderer({
  stage,
  playerPos,
  processSelections,
  onProcessChange,
}: {
  stage: StageData;
  playerPos: { x: number; z: number } | null;
  processSelections: Record<number, number>;
  onProcessChange: (objectId: number, processIndex: number) => void;
}) {
  const totalSize = 3 * 20; // GRID_SIZE * AREA_SIZE

  return (
    <>
      <Ground size={totalSize} />
      <AreaGrid areas={stage.areas} />
      {stage.objects.map((obj) => (
        <River key={obj.id} object={obj} />
      ))}
      {stage.areas.flatMap((area) =>
        area.worldObjects.map((wo) => (
          <WorldObjectMarker
            key={wo.id}
            obj={wo}
            playerPos={playerPos}
            selectedProcess={processSelections[wo.id] ?? 0}
            onProcessChange={onProcessChange}
          />
        )),
      )}
    </>
  );
}
