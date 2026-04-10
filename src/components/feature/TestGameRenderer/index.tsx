import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { type StageData } from "../../../hooks/useSocket";
import { StageRenderer } from "../../feature/StageRenderer";
import { PlayerBox } from "../../PlayerBox";
import type { PlayerBody } from "../../../hooks/useSocket";

interface Props {
  bodies: PlayerBody[];
  myId: string | null;
  stage: StageData | null;
}

const TestGameRenderer = ({ bodies, myId, stage }: Props) => {
  const myBody = bodies.find((b) => b.playerId === myId);
  const playerPos = myBody
    ? { x: myBody.position.x, z: myBody.position.z }
    : null;

  return (
    <main
      style={
        {
          width: "100vw",
          height: "100vh",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        } as React.CSSProperties
      }
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
        <ambientLight intensity={3.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        {stage && <StageRenderer stage={stage} playerPos={playerPos} />}
        {bodies.map((body) => (
          <PlayerBox
            key={body.playerId}
            body={body}
            isMe={body.playerId === myId}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </main>
  );
};

export default TestGameRenderer;
