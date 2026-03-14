import { Link, useParams } from "react-router-dom";

const MakeFurnitureExample = () => {
  const { furnitureId } = useParams();
  return (
    <div className="make-furniture-example">
      <h1>Make Furniture Example</h1>
      <p>Furniture ID: {furnitureId}</p>
      <Link to="/make-furniture">Go to Make Furniture</Link>
    </div>
  );
};

export default MakeFurnitureExample;
