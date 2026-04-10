import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useKeyboardInput } from "../../../hooks/useKeyboardInput";
import { useSocket } from "../../../hooks/useSocket";
import GameRenderer from "../../feature/GameRenderer";
import { InteractButton } from "../../InteractButton";
import { InventoryPanel } from "../../InventoryPanel";
import { JoystickPad } from "../../JoystickPad";
import { ProcessSwitcher } from "../../ProcessSwitcher";
// import TestGameRenderer from "../../feature/TestGameRenderer";

const Game = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    bodies,
    myId,
    stage,
    sendInput,
    inventory,
    lastWorkResult,
    gameCleared,
  } = useSocket(roomId ?? "room-A");

  useEffect(() => {
    if (gameCleared) {
      alert("ゲームクリア！");
      navigate("/");
    }
  }, [gameCleared, navigate]);
  // objectId → 選択中の processIndex
  const [processSelections, setProcessSelections] = useState<
    Record<number, number>
  >({});

  useKeyboardInput(sendInput);

  const playerPos = useMemo(() => {
    const myBody = bodies.find((b) => b.playerId === myId);
    return myBody ? { x: myBody.position.x, z: myBody.position.z } : null;
  }, [bodies, myId]);

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
      <GameRenderer bodies={bodies} myId={myId} stage={stage} />
      <InventoryPanel inventory={inventory} sendInput={sendInput} />
      <JoystickPad sendInput={sendInput} />
      <ProcessSwitcher
        playerPos={playerPos}
        worldObjects={allWorldObjects}
        processSelections={processSelections}
        onProcessChange={onProcessChange}
        workResult={lastWorkResult}
      />
      <InteractButton
        sendInput={sendInput}
        playerPos={playerPos}
        worldObjects={allWorldObjects}
        processSelections={processSelections}
      />
      {/* <TestGameRenderer bodies={bodies} myId={myId} stage={stage} /> */}
    </>
  );
};

export default Game;
