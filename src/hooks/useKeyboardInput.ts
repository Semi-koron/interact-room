import { useEffect } from "react";

const FORCE = 2;

export function useKeyboardInput(
  sendInput: (impulse: { x: number; y: number; z: number }) => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const impulse = { x: 0, y: 0, z: 0 };
      switch (e.key.toLowerCase()) {
        case "w":
          impulse.z = -FORCE;
          break;
        case "s":
          impulse.z = FORCE;
          break;
        case "a":
          impulse.x = -FORCE;
          break;
        case "d":
          impulse.x = FORCE;
          break;
        case " ":
          impulse.y = FORCE * 2;
          break;
        default:
          return;
      }
      sendInput(impulse);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sendInput]);
}
