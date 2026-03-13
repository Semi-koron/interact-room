import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { PlayerSphere } from "./PlayerSphere";
import type { Body } from "../hooks/useSocket";

interface Props {
  bodies: Body[];
  myId: string | null;
}

export function Scene({ bodies, myId }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 8, 12], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <Grid
        args={[50, 50]}
        position={[0, 0, 0]}
        cellColor="#6f6f6f"
        sectionColor="#9d4b4b"
      />

      {bodies.map((body) => (
        <PlayerSphere
          key={body.playerId}
          body={body}
          isMe={body.playerId === myId}
        />
      ))}

      <OrbitControls />
    </Canvas>
  );
}
