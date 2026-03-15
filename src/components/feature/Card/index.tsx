import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
type Furniture = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

const CreateFurniture = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const testFurnitureData: Furniture[] = [
    {
      id: 1,
      name: "机",
      description: "これは机の説明です。",
      imageUrl: "https://example.com/desk.jpg",
    },
    {
      id: 2,
      name: "椅子",
      description: "これは椅子の説明です。",
      imageUrl: "https://example.com/chair.jpg",
    },
    {
      id: 3,
      name: "ソファ",
      description: "これはソファの説明です。",
      imageUrl: "https://example.com/sofa.jpg",
    },
    {
      id: 4,
      name: "ベッド",
      description: "これはベッドの説明です。",
      imageUrl: "https://example.com/bed.jpg",
    },
    {
      id: 5,
      name: "本棚",
      description: "これは本棚の説明です。",
      imageUrl: "https://example.com/bookshelf.jpg",
    },
    {
      id: 6,
      name: " カーテン",
      description: "これはカーテンの説明です。",
      imageUrl: "https://example.com/curtain.jpg",
    },
    {
      id: 7,
      name: "窓ガラス",
      description: "これは窓ガラスの説明です。",
      imageUrl: "https://example.com/window.jpg",
    },
    {
      id: 8,
      name: "ドア",
      description: "これはドアの説明です。",
      imageUrl: "https://example.com/door.jpg",
    },
    {
      id: 9,
      name: "棚",
      description: "これは棚の説明です。",
      imageUrl: "https://example.com/shelf.jpg",
    },
    {
      id: 10,
      name: "花瓶",
      description: "これは花瓶の説明です。",
      imageUrl: "https://example.com/vase.jpg",
    },
    {
      id: 11,
      name: "カーペット",
      description: "これはカーペットの説明です。",
      imageUrl: "https://example.com/carpet.jpg",
    },
  ];
  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleNavigate = () => {
    if (selectedId !== null) navigate(`/furniture/${selectedId}`);
  };

  const selectedName = testFurnitureData.find(
    (furniture) => furniture.id === selectedId,
  )?.name;

  return (
    <div className={styles["page"]}>
      <h1 className={styles["heading"]}>家具一覧</h1>
      <div className={styles["grid"]}>
        {testFurnitureData.map((furniture) => (
          <div
            key={furniture.id}
            className={`${styles["card"]} ${selectedId === furniture.id ? styles["selected"] : ""}`}
            onClick={() => handleSelect(furniture.id)}
            role="button"
            aria-pressed={selectedId === furniture.id}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSelect(furniture.id)}
          >
            <img
              src={furniture.imageUrl}
              alt={furniture.name}
              className={styles["image"]}
            />
            <div className={styles["body"]}>
              <h2 className={styles["name"]}>{furniture.name}</h2>
              <p className={styles["description"]}>{furniture.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles["Footer"]}>
        <Link to="/" className={styles["link"]}>
          戻る
        </Link>
        {selectedId && (
          <button className={styles["goButton"]} onClick={handleNavigate}>
            {selectedName}の作成
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateFurniture;
