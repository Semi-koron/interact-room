import Top from "./components/Pages/Top/Top";
import AssembleFurniture from "./components/Pages/AssembleFurniture/AssembleFurniture";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Pages/Login/Login";
import Signup from "./components/Pages/Signup/Signup";
import ShowAllFurniture from "./components/Pages/ShowAllFurniture/ShowAllFurniture";
import MakeFurniture from "./components/Pages/MakeFurniture/MakeFurniture";
import MakeFurnitureExample from "./components/Pages/MakeFurnitureExample/MakeFurnitureExample";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/show-all-furniture" element={<ShowAllFurniture />} />
        <Route path="/assemble-furniture" element={<AssembleFurniture />} />
        <Route path="/make-furniture" element={<MakeFurniture />} />
        <Route
          path="/furniture/:furnitureId"
          element={<MakeFurnitureExample />}
        />
      </Routes>
    </>
  );
}

export default App;
