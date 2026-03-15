import { useMemo, useState, useCallback } from "react";
import { useKeyboardInput } from "../../../hooks/useKeyboardInput";
import { useSocket } from "../../../hooks/useSocket";
import GameRenderer from "../../feature/GameRenderer";
import { InteractButton } from "../../InteractButton";
import { InventoryPanel } from "../../InventoryPanel";
import { JoystickPad } from "../../JoystickPad";

const Game = () => {
  const { bodies, myId, stage, sendInput, inventory } = useSocket();
  // objectId → 選択中の processIndex
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
      <GameRenderer
        bodies={bodies}
        myId={myId}
        stage={stage}
        processSelections={processSelections}
        onProcessChange={onProcessChange}
      />
      <InventoryPanel inventory={inventory} sendInput={sendInput} />
      <JoystickPad sendInput={sendInput} />
      <InteractButton
        sendInput={sendInput}
        playerPos={playerPos}
        worldObjects={allWorldObjects}
        processSelections={processSelections}
      />
    </>
  );
};

export default Game;
