import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import type { Body } from "../hooks/useSocket";

const _target = new Vector3();

interface Props {
  body: Body;
  isMe: boolean;
}

export function PlayerSphere({ body, isMe }: Props) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const { x, y, z } = body.position;
      meshRef.current.position.lerp(_target.set(x, y, z), 0.3);
    }
  });

  return (
    <mesh ref={meshRef} position={[body.position.x, body.position.y, body.position.z]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={isMe ? "#4fc3f7" : "#ff8a65"} />
    </mesh>
  );
}
