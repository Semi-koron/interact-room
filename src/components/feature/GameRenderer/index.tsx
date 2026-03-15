import { type StageData } from "../../../hooks/useSocket";
import { StageRenderer } from "../../feature/StageRenderer";
import { PlayerBox } from "../../PlayerBox";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { PlayerBody } from "../../../hooks/useSocket";

interface Props {
  bodies: PlayerBody[];
  myId: string | null;
  stage: StageData | null;
  processSelections: Record<number, number>;
  onProcessChange: (objectId: number, processIndex: number) => void;
}

const GameRenderer = ({
  bodies,
  myId,
  stage,
  processSelections,
  onProcessChange,
}: Props) => {
  const myBody = bodies.find((b) => b.playerId === myId);
  const playerPos = myBody
    ? { x: myBody.position.x, z: myBody.position.z }
    : null;

  return (
    <Canvas
      camera={{ position: [0, 8, 12], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {stage && (
        <StageRenderer
          stage={stage}
          playerPos={playerPos}
          processSelections={processSelections}
          onProcessChange={onProcessChange}
        />
      )}
      {/* プレイヤー描画など */}
      {bodies.map((body) => (
        <PlayerBox
          key={body.playerId}
          body={body}
          isMe={body.playerId === myId}
        />
      ))}
      <OrbitControls />
    </Canvas>
  );
};

export default GameRenderer;
