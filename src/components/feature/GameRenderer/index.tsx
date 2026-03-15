import { type StageData } from "../../../hooks/useSocket";
import { StageRenderer } from "../../feature/StageRenderer";
import { PlayerBox } from "../../PlayerBox";
import type { PlayerBody } from "../../../hooks/useSocket";
import { ARCanvas } from "react-three-mindts";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface Props {
  bodies: PlayerBody[];
  myId: string | null;
  stage: StageData | null;
}

const GameRenderer = ({ bodies, myId, stage }: Props) => {
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
      <Canvas>
        {/* <ARCanvas markerUrl="/postcard.mind"> */}
        {/* <group scale={0.1} rotation={[Math.PI / 2, 0, 0]}> */}
        <ambientLight intensity={3.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        {stage && <StageRenderer stage={stage} playerPos={playerPos} />}
        {/* プレイヤー描画など */}
        {bodies.map((body) => (
          <PlayerBox
            key={body.playerId}
            body={body}
            isMe={body.playerId === myId}
          />
        ))}
        <OrbitControls />
        {/* </group> */}
        {/* </ARCanvas> */}
      </Canvas>
    </main>
  );
};

export default GameRenderer;
