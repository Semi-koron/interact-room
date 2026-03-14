import { useEffect } from "react";

export function useKeyboardInput(
  sendInput: (message: {
    eventName: string;
    content: Record<string, unknown>;
  }) => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const message = { eventName: "", content: {} };
      switch (e.key.toLowerCase()) {
        case "w":
          message.eventName = "move:forward";
          break;
        case "s":
          message.eventName = "move:backward";
          break;
        case "a":
          message.eventName = "rotate:left";
          break;
        case "d":
          message.eventName = "rotate:right";
          break;
        case " ":
          break;
        default:
          return;
      }
      sendInput(message);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sendInput]);
}
