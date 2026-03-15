import { useState } from "react";
import type { InventoryItem } from "../hooks/useSocket";

interface Props {
  inventory: InventoryItem[];
  sendInput: (message: {
    eventName: string;
    content: Record<string, unknown>;
  }) => void;
}

export function InventoryPanel({ inventory, sendInput }: Props) {
  // 選択中のアイテム (ドロップ数量を決める画面)
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [dropCount, setDropCount] = useState(1);

  const openDrop = (item: InventoryItem) => {
    setSelected(item);
    setDropCount(1);
  };

  const closeDrop = () => {
    setSelected(null);
  };

  const handleDrop = () => {
    if (!selected) return;
    sendInput({
      eventName: "drop",
      content: { itemId: selected.id, count: dropCount },
    });
    closeDrop();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 10,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 14,
        minWidth: 140,
        userSelect: "none",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>Inventory</div>
      {inventory.length === 0 ? (
        <div style={{ color: "#aaa", fontSize: 12 }}>Empty</div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {inventory.map((item) => (
            <li
              key={item.id}
              onClick={() => openDrop(item)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "4px 6px",
                borderRadius: 4,
                cursor: "pointer",
                background:
                  selected?.id === item.id
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
              }}
            >
              <span>{item.name}</span>
              <span style={{ color: "#ffcc00" }}>x{item.number}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ドロップ数量選択UI */}
      {selected && (
        <div
          style={{
            marginTop: 8,
            padding: "8px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 6,
          }}
        >
          <div style={{ fontSize: 12, marginBottom: 6 }}>
            Drop: {selected.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <button
              type="button"
              onClick={() => setDropCount((c) => Math.max(1, c - 1))}
              style={btnStyle}
            >
              -
            </button>
            <span style={{ minWidth: 28, textAlign: "center" }}>
              {dropCount}
            </span>
            <button
              type="button"
              onClick={() =>
                setDropCount((c) => Math.min(selected.number, c + 1))
              }
              style={btnStyle}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setDropCount(selected.number)}
              style={{ ...btnStyle, fontSize: 10, padding: "2px 6px" }}
            >
              ALL
            </button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={handleDrop} style={dropBtnStyle}>
              Drop
            </button>
            <button type="button" onClick={closeDrop} style={cancelBtnStyle}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  color: "#fff",
  fontSize: 16,
  width: 28,
  height: 28,
  borderRadius: 4,
  cursor: "pointer",
};

const dropBtnStyle: React.CSSProperties = {
  flex: 1,
  background: "#cc4444",
  border: "none",
  color: "#fff",
  fontSize: 13,
  padding: "4px 8px",
  borderRadius: 4,
  cursor: "pointer",
};

const cancelBtnStyle: React.CSSProperties = {
  flex: 1,
  background: "rgba(255,255,255,0.15)",
  border: "none",
  color: "#fff",
  fontSize: 13,
  padding: "4px 8px",
  borderRadius: 4,
  cursor: "pointer",
};
