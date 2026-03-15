import Top from "./components/Pages/Top";
import AssembleFurniture from "./components/Pages/AssembleFurniture";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Pages/Login";
import ShowAllFurniture from "./components/Pages/ShowAllFurniture";
import MakeFurniture from "./components/Pages/MakeFurniture";
import MakeFurnitureExample from "./components/Pages/MakeFurnitureExample/MakeFurnitureExample";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/login" element={<Login />} />
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
