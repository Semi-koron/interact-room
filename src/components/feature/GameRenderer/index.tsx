import { type StageData } from "../../../hooks/useSocket";
import { StageRenderer } from "../../feature/StageRenderer";
import { PlayerBox } from "../../PlayerBox";
import type { PlayerBody } from "../../../hooks/useSocket";
import { ARCanvas } from "react-three-mindts";

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
    <main style={{ width: "100vw", height: "100vh" }}>
      <ARCanvas markerUrl="/kyutxr-card.mind">
        <group scale={0.1} rotation={[Math.PI / 2, 0, 0]}>
          <ambientLight intensity={3.4} />
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
        </group>
      </ARCanvas>
    </main>
  );
};

export default GameRenderer;
