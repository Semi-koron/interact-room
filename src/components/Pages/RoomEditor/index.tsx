import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  useGLTF,
  Outlines,
} from "@react-three/drei";
import { Link } from "react-router-dom";
import { useRoomEditorStore, FURNITURE_MODELS, type RoomObject } from "./store";

// --- GLB Model ---
function FurnitureModel({
  url,
  isSelected,
}: {
  url: string;
  isSelected: boolean;
}) {
  const { scene } = useGLTF(url);
  const cloned = scene.clone();

  return (
    <primitive object={cloned}>
      {isSelected && <Outlines thickness={10} color="yellow" />}
    </primitive>
  );
}

// --- Mini preview for palette ---
function ModelPreview({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = scene.clone();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} scale={1} />
    </group>
  );
}

// --- 3D Scene ---
function SceneContent() {
  const {
    objects,
    selectedId,
    setSelectedId,
    editMode,
    placingModel,
    addObject,
    setObjectPos,
    setObjectRot,
  } = useRoomEditorStore();

  const { raycaster, scene, camera, pointer } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformRef = useRef<any>(null);
  const [previewPos, setPreviewPos] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  useFrame(() => {
    if (placingModel) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(
        scene.children.filter((c) => !c.userData?.ignoreRaycast),
        true,
      );
      if (intersects.length > 0) {
        const p = intersects[0].point;
        setPreviewPos([p.x, p.y, p.z]);
      }
    }
  });

  return (
    <>
      <OrbitControls enabled={!placingModel} makeDefault />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          if (placingModel) {
            e.stopPropagation();
            const p = e.point;
            const newObj: RoomObject = {
              id: `obj-${Date.now()}`,
              modelUrl: placingModel.modelUrl,
              label: placingModel.label,
              position: [p.x, p.y, p.z],
              rotation: [0, 0, 0],
            };
            addObject(newObj);
            useRoomEditorStore.getState().setPlacingModel(null);
          }
        }}
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#b8c9a3" />
      </mesh>
      <gridHelper args={[50, 50, "#888", "#ccc"]} />

      {/* Transform controls */}
      {!placingModel && selectedId && (
        <TransformControls
          ref={transformRef}
          object={scene.getObjectByName(selectedId)}
          mode={editMode}
          onObjectChange={() => {
            if (transformRef.current?.object) {
              const pos = transformRef.current.object.position;
              const rot = transformRef.current.object.rotation;
              setObjectPos(selectedId, [pos.x, pos.y, pos.z]);
              setObjectRot(selectedId, [rot.x, rot.y, rot.z]);
            }
          }}
        />
      )}

      {/* Placed objects */}
      {objects.map((item) => (
        <group
          key={item.id}
          name={item.id}
          position={item.position}
          rotation={item.rotation}
          onClick={(e) => {
            if (!placingModel) {
              e.stopPropagation();
              setSelectedId(item.id);
            }
          }}
        >
          <Suspense fallback={null}>
            <FurnitureModel
              url={item.modelUrl}
              isSelected={item.id === selectedId}
            />
          </Suspense>
        </group>
      ))}

      {/* Placement preview */}
      {placingModel && (
        <group position={previewPos} userData={{ ignoreRaycast: true }}>
          <Suspense fallback={null}>
            <FurnitureModel url={placingModel.modelUrl} isSelected={false} />
          </Suspense>
        </group>
      )}
    </>
  );
}

// --- Position Panel ---
function PositionPanel() {
  const { selectedId, objects, setObjectPos, setObjectRot } =
    useRoomEditorStore();
  const item = objects.find((o) => o.id === selectedId);

  if (!item) return null;

  const pos = item.position;
  const rot = item.rotation;

  const handlePos = (axis: 0 | 1 | 2, val: number) => {
    const next = [...pos] as [number, number, number];
    next[axis] = val;
    setObjectPos(item.id, next);
  };

  const handleRot = (axis: 0 | 1 | 2, deg: number) => {
    const next = [...rot] as [number, number, number];
    next[axis] = (deg * Math.PI) / 180;
    setObjectRot(item.id, next);
  };

  const axes = ["X", "Y", "Z"] as const;
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "2px 6px",
    border: "1px solid #d1d5db",
    borderRadius: 4,
    fontSize: 12,
  };

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>位置</p>
      {axes.map((a, i) => (
        <div
          key={a}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 11, width: 14 }}>{a}</span>
          <input
            type="number"
            step="0.1"
            value={pos[i].toFixed(2)}
            onChange={(e) =>
              handlePos(i as 0 | 1 | 2, parseFloat(e.target.value) || 0)
            }
            style={inputStyle}
          />
        </div>
      ))}
      <p style={{ fontSize: 12, fontWeight: 600, margin: "8px 0 4px" }}>
        回転 (度)
      </p>
      {axes.map((a, i) => (
        <div
          key={a}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 11, width: 14 }}>{a}</span>
          <input
            type="number"
            step="1"
            value={((rot[i] * 180) / Math.PI).toFixed(1)}
            onChange={(e) =>
              handleRot(i as 0 | 1 | 2, parseFloat(e.target.value) || 0)
            }
            style={inputStyle}
          />
        </div>
      ))}
    </div>
  );
}

// --- Shared styles ---
const panelStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(8px)",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  padding: 12,
};

const btnBase: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 13,
  cursor: "pointer",
  background: "#fff",
};

// --- Floating furniture palette ---
function FurniturePalette() {
  const [open, setOpen] = useState(false);
  const { placingModel, setPlacingModel } = useRoomEditorStore();

  return (
    <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 20 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          ...btnBase,
          background: open ? "#333" : "#3b82f6",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {open ? "閉じる" : "家具を追加"}
      </button>

      {open && (
        <div style={{ ...panelStyle, width: 240 }}>
          <p style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>
            選択 → 床をクリックで配置
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {FURNITURE_MODELS.map((m) => {
              const isActive = placingModel?.modelUrl === m.modelUrl;
              return (
                <div
                  key={m.modelUrl}
                  onClick={() => {
                    if (isActive) {
                      setPlacingModel(null);
                    } else {
                      setPlacingModel({ modelUrl: m.modelUrl, label: m.label });
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    borderRadius: 8,
                    border: isActive
                      ? "2px solid #3b82f6"
                      : "2px solid #e5e7eb",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <div style={{ height: 80 }}>
                    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[2, 4, 2]} intensity={80} />
                      <Suspense fallback={null}>
                        <ModelPreview url={m.modelUrl} />
                      </Suspense>
                    </Canvas>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      textAlign: "center",
                      padding: "4px 0",
                      fontWeight: 500,
                    }}
                  >
                    {m.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---
const RoomEditor = () => {
  const {
    objects,
    selectedId,
    setSelectedId,
    editMode,
    setEditMode,
    placingModel,
    setPlacingModel,
    removeObject,
  } = useRoomEditorStore();

  useEffect(() => {
    FURNITURE_MODELS.forEach((m) => useGLTF.preload(m.modelUrl));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Full-screen Canvas */}
      <Canvas
        shadows
        camera={{ position: [15, 15, 15], fov: 50 }}
        style={{ position: "absolute", inset: 0 }}
        onPointerMissed={() => {
          if (!placingModel) setSelectedId(null);
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 16px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Link
          to="/"
          style={{ ...btnBase, textDecoration: "none", color: "#333" }}
        >
          戻る
        </Link>
        <span style={{ fontWeight: 600, fontSize: 18 }}>ルームエディタ</span>
        <div style={{ flex: 1 }} />
        {placingModel && (
          <button
            onClick={() => setPlacingModel(null)}
            style={{
              ...btnBase,
              background: "#f59e0b",
              color: "#fff",
              border: "none",
            }}
          >
            配置キャンセル
          </button>
        )}
        <select
          value={editMode}
          onChange={(e) =>
            setEditMode(e.target.value as "translate" | "rotate")
          }
          style={{ ...btnBase, padding: "4px 8px" }}
        >
          <option value="translate">移動</option>
          <option value="rotate">回転</option>
        </select>
        {selectedId && (
          <button
            onClick={() => removeObject(selectedId)}
            style={{
              ...btnBase,
              background: "#ef4444",
              color: "#fff",
              border: "none",
            }}
          >
            削除
          </button>
        )}
      </div>

      {/* Selected object panel */}
      {selectedId && (
        <div
          style={{
            ...panelStyle,
            position: "fixed",
            top: 56,
            right: 16,
            zIndex: 20,
            width: 200,
          }}
        >
          <PositionPanel />
        </div>
      )}

      {/* Object list */}
      {objects.length > 0 && (
        <div
          style={{
            ...panelStyle,
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 20,
            width: 200,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            配置済み ({objects.length})
          </p>
          {objects.map((obj) => (
            <div
              key={obj.id}
              onClick={() => {
                setSelectedId(obj.id);
                setPlacingModel(null);
              }}
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 4,
                cursor: "pointer",
                marginBottom: 2,
                background: obj.id === selectedId ? "#3b82f6" : "transparent",
                color: obj.id === selectedId ? "#fff" : "#333",
              }}
            >
              {obj.label}
            </div>
          ))}
        </div>
      )}

      {/* Furniture palette */}
      <FurniturePalette />
    </div>
  );
};

export default RoomEditor;
