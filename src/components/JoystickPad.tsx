import { useRef, useCallback } from "react";
import { Joystick } from "react-joystick-component";
import type { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

const THROTTLE_MS = 50;

interface Props {
  sendInput: (message: {
    eventName: string;
    content: Record<string, unknown>;
  }) => void;
}

export function JoystickPad({ sendInput }: Props) {
  const lastSentRef = useRef(0);

  const handleMove = useCallback(
    (e: IJoystickUpdateEvent) => {
      const now = Date.now();
      if (now - lastSentRef.current < THROTTLE_MS) return;
      lastSentRef.current = now;

      sendInput({
        eventName: "joystick",
        content: { x: e.x ?? 0, y: e.y ?? 0 },
      });
    },
    [sendInput],
  );

  const handleStop = useCallback(() => {
    sendInput({
      eventName: "joystick",
      content: { x: 0, y: 0 },
    });
  }, [sendInput]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 40,
        left: 40,
        zIndex: 10,
        touchAction: "none",
      }}
    >
      <Joystick
        size={120}
        baseColor="rgba(0,0,0,0.2)"
        stickColor="rgba(0,0,0,0.6)"
        throttle={THROTTLE_MS}
        move={handleMove}
        stop={handleStop}
      />
    </div>
  );
}
