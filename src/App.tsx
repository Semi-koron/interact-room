import { Scene } from "./components/Scene";
import { JoystickPad } from "./components/JoystickPad";
import { useSocket } from "./hooks/useSocket";
import { useKeyboardInput } from "./hooks/useKeyboardInput";

function App() {
  const { bodies, myId, sendInput } = useSocket();
  useKeyboardInput(sendInput);

  return (
    <>
      <Scene bodies={bodies} myId={myId} />
      <JoystickPad sendInput={sendInput} />
    </>
  );
}

export default App;
