import React from "react";
import { Scene } from "./components/Scene";
import { JoystickPad } from "./components/JoystickPad";
import { useSocket } from "./hooks/useSocket";
import { useKeyboardInput } from "./hooks/useKeyboardInput";
import AuthForm from "./components/feature/LoginForm";

function App() {
  const { bodies, myId, sendInput } = useSocket();
  useKeyboardInput(sendInput);

  return (
    <>
      <AuthForm />
    </>
  );
}

export default App;
