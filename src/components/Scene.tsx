import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { PlayerBox } from "./PlayerBox";
import type { PlayerBody } from "../hooks/useSocket";

interface Props {
  bodies: PlayerBody[];
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
        args={[60, 60]}
        position={[0, 0, 0]}
        cellColor="#6f6f6f"
        sectionColor="#9d4b4b"
      />

      <mesh position={[10, 0, -20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[10, 0, 0]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[10, 0, 20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      <mesh position={[30, 0, -20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[30, 0, 0]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[30, 0, 20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      <mesh position={[-10, 0, -20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[-10, 0, 0]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[-10, 0, 20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      <mesh position={[-30, 0, -20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[-30, 0, 0]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[-30, 0, 20]}>
        <boxGeometry args={[2, 2, 20]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      <mesh position={[-20, 0, 10]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[20, 0, 10]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      <mesh position={[-20, 0, 30]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[0, 0, 30]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[20, 0, 30]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      <mesh position={[-20, 0, -10]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[0, 0, -10]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[20, 0, -10]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>

      <mesh position={[-20, 0, -30]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[0, 0, -30]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
      <mesh position={[20, 0, -30]}>
        <boxGeometry args={[20, 2, 2]} />
        <meshStandardMaterial color="#6f6f6f" />
      </mesh>
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
}
