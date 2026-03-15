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

/** ドロップアイテム マーカー */
function DroppedItemMarker({ obj }: { obj: WorldObjectData }) {
  if (obj.destroyed) return null;

  const itemDef = ITEM_DEFS.get(obj.objectId);
  const name = itemDef?.name ?? "Item";

  return (
    <group position={[obj.position.x, 0, obj.position.z]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#88cc44" />
      </mesh>
      <Html position={[0, 0.8, 0]} center distanceFactor={10}>
        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "#88cc44",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 11,
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

/** WorldObject マーカー */
function WorldObjectMarker({
  obj,
  playerPos,
}: {
  obj: WorldObjectData;
  playerPos: { x: number; z: number } | null;
}) {
  if (obj.destroyed) return null;

  const def = OBJECT_DEFS.get(obj.objectId);
  const reach = def?.reach ?? 3;

  const inRange = (() => {
    if (!playerPos) return false;
    const dx = playerPos.x - obj.position.x;
    const dz = playerPos.z - obj.position.z;
    return dx * dx + dz * dz <= reach * reach;
  })();

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

    </group>
  );
}

/** ステージ全体 */
export function StageRenderer({
  stage,
  playerPos,
}: {
  stage: StageData;
  playerPos: { x: number; z: number } | null;
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
        area.worldObjects.map((wo) =>
          wo.isDropped ? (
            <DroppedItemMarker key={wo.instanceId} obj={wo} />
          ) : (
            <WorldObjectMarker
              key={wo.instanceId}
              obj={wo}
              playerPos={playerPos}
            />
          ),
        ),
      )}
    </>
  );
}
