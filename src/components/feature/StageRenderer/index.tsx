import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Html, Outlines, useGLTF } from "@react-three/drei";
import type { StageData, WorldObjectData } from "../../../hooks/useSocket";
import { OBJECT_DEFS } from "../../../data/Object/index";
import { ITEM_DEFS } from "../../../data/Items/index";

/** objectId → GLB パス */
const OBJECT_MODEL_MAP: Record<number, string> = {
  101: "/worldobject/tree.glb",
  102: "/worldobject/rock.glb",
  103: "/worldobject/iron.glb",
  104: "/worldobject/desart.glb",
  105: "/worldobject/cotton.glb",
  201: "/worldobject/crafttable.glb",
  202: "/worldobject/furnce.glb",
  301: "/worldobject/bridge.glb",
};

/** GLB モデル表示用コンポーネント */
function WorldObjectModel({ url, inRange }: { url: string; inRange: boolean }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);

  // シーン内の全メッシュを収集
  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) list.push(child as THREE.Mesh);
    });
    return list;
  }, [cloned]);

  return (
    <group>
      <primitive object={cloned} />
      {inRange &&
        meshes.map((mesh, i) => (
          <mesh key={i} geometry={mesh.geometry} matrixWorld={mesh.matrixWorld}>
            <Outlines thickness={10} color="yellow" />
          </mesh>
        ))}
    </group>
  );
}

/** 地面タイル1枚 */
function GroundTile({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF("/worldobject/ground.glb");
  const cloned = scene.clone();
  return <primitive object={cloned} position={position} scale={[10, 10, 10]} />;
}

/** 地面 (ground.glb を 3x3 に並べる) */
function Ground() {
  const areaSize = 20;
  const offsets = [-1, 0, 1];
  return (
    <Suspense
      fallback={
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[60, 0.2, 60]} />
          <meshStandardMaterial color="#4a7c59" />
        </mesh>
      }
    >
      {offsets.map((gx) =>
        offsets.map((gz) => (
          <GroundTile
            key={`${gx}_${gz}`}
            position={[gx * areaSize, -0.1, gz * areaSize]}
          />
        )),
      )}
    </Suspense>
  );
}

/** エリアの境界線 (デバッグ用、任意) */
// function AreaGrid({ areas }: { areas: StageData["areas"] }) {
//   return null; // とりあえず非表示
//     return (
//       <>
//         {areas.map((area) => (
//           <mesh key={area.id} position={[area.center.x, 0.01, area.center.z]}>
//             <planeGeometry args={[area.size, area.size]} />
//             <meshStandardMaterial
//               color="#5a8c69"
//               transparent
//               opacity={0.3}
//               wireframe
//             />
//           </mesh>
//         ))}
//       </>
//     );
// }

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
  const isBridge = obj.objectId === 301;

  // Bridge: destroyed後にだけ表示 / それ以外: destroyed前にだけ表示
  if (isBridge && !obj.destroyed) return null;
  if (!isBridge && obj.destroyed) return null;

  const def = OBJECT_DEFS.get(obj.objectId);
  const reach = def?.reach ?? 3;

  const inRange = (() => {
    if (!playerPos) return false;
    const dx = playerPos.x - obj.position.x;
    const dz = playerPos.z - obj.position.z;
    return dx * dx + dz * dz <= reach * reach;
  })();

  const modelUrl = OBJECT_MODEL_MAP[obj.objectId];

  return (
    <group position={[obj.position.x, 1, obj.position.z]}>
      {modelUrl ? (
        <Suspense fallback={null}>
          <WorldObjectModel url={modelUrl} inRange={inRange} />
        </Suspense>
      ) : (
        <>
          {/* フォールバック: GLBがないオブジェクト */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
            <meshStandardMaterial color="#d4a030" />
            {inRange && <Outlines thickness={10} color="yellow" />}
          </mesh>
        </>
      )}
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
  return (
    <>
      <Ground />
      {/* <AreaGrid areas={stage.areas} /> */}
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
