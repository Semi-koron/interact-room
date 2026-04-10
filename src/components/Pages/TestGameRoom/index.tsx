import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useKeyboardInput } from "../../../hooks/useKeyboardInput";
import { useSocket } from "../../../hooks/useSocket";
import TestGameRenderer from "../../feature/TestGameRenderer";
import { InteractButton } from "../../InteractButton";
import { InventoryPanel } from "../../InventoryPanel";
import { JoystickPad } from "../../JoystickPad";
import { ProcessSwitcher } from "../../ProcessSwitcher";

const TestGameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { bodies, myId, stage, sendInput, inventory, gameCleared } = useSocket(
    roomId ?? "room-A",
  );

  useEffect(() => {
    if (gameCleared) {
      alert("ゲームクリア！");
      navigate("/");
    }
  }, [gameCleared, navigate]);

  const [processSelections, setProcessSelections] = useState<
    Record<number, number>
  >({});

  useKeyboardInput(sendInput);

  const myBody = bodies.find((b) => b.playerId === myId);
  const playerPos = myBody
    ? { x: myBody.position.x, z: myBody.position.z }
    : null;

  const allWorldObjects = useMemo(
    () => stage?.areas.flatMap((a) => a.worldObjects) ?? [],
    [stage],
  );

  const onProcessChange = useCallback(
    (objectId: number, processIndex: number) => {
      setProcessSelections((prev) => ({ ...prev, [objectId]: processIndex }));
    },
    [],
  );

  return (
    <>
      <TestGameRenderer bodies={bodies} myId={myId} stage={stage} />
      <InventoryPanel inventory={inventory} sendInput={sendInput} />
      <JoystickPad sendInput={sendInput} />
      <ProcessSwitcher
        playerPos={playerPos}
        worldObjects={allWorldObjects}
        processSelections={processSelections}
        onProcessChange={onProcessChange}
      />
      <InteractButton
        sendInput={sendInput}
        playerPos={playerPos}
        worldObjects={allWorldObjects}
        processSelections={processSelections}
      />
    </>
  );
};

export default TestGameRoom;
