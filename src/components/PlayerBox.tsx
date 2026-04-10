import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Quaternion, Group } from "three";
import type { PlayerBody } from "../hooks/useSocket";

const _posTarget = new Vector3();
const _rotTarget = new Quaternion();

interface Props {
  body: PlayerBody;
  isMe: boolean;
}

export function PlayerBox({ body, isMe }: Props) {
  const meshRef = useRef<Group>(null);

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
    <group
      ref={meshRef as unknown as React.RefObject<Group>}
      position={[body.position.x, body.position.y, body.position.z]}
      quaternion={[
        body.rotation.x,
        body.rotation.y,
        body.rotation.z,
        body.rotation.w,
      ]}
    >
      {/* 本体 */}
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color={isMe ? "#4fc3f7" : "#ff8a65"} />
      </mesh>
      {/* 前方向を示す矢印 (Z- 方向が前) */}
      <mesh position={[0, 0.5, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial color={isMe ? "#ffffff" : "#ffcc00"} />
      </mesh>
    </group>
  );
}
