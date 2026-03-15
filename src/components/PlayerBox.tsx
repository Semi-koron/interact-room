import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3, Quaternion } from "three";
import type { PlayerBody } from "../hooks/useSocket";

const _posTarget = new Vector3();
const _rotTarget = new Quaternion();

interface Props {
  body: PlayerBody;
  isMe: boolean;
}

export function PlayerBox({ body, isMe }: Props) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const { x, y, z } = body.position;
      meshRef.current.position.lerp(_posTarget.set(x, y, z), 0.3);

      const rot = body.rotation;
      meshRef.current.quaternion.slerp(
        _rotTarget.set(rot.x, rot.y, rot.z, rot.w),
        0.3,
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[body.position.x, body.position.y, body.position.z]}
      quaternion={[
        body.rotation.x,
        body.rotation.y,
        body.rotation.z,
        body.rotation.w,
      ]}
    >
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={isMe ? "#4fc3f7" : "#ff8a65"} />
    </mesh>
  );
}
