import { Scene } from "./components/Scene";
import { useSocket } from "./hooks/useSocket";
import { useKeyboardInput } from "./hooks/useKeyboardInput";

function App() {
  const { bodies, myId, sendInput } = useSocket();
  useKeyboardInput(sendInput);

  return <Scene bodies={bodies} myId={myId} />;
}

export default App;
