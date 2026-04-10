import { useState } from "react";
import type { InventoryItem } from "../hooks/useSocket";
import { ITEM_IMAGE } from "../data/itemImages";

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
        top: "50%",
        right: 12,
        transform: "translateY(-50%)",
        zIndex: 10,
        color: "#fff",
        padding: "10px 8px",
        fontSize: 14,
        userSelect: "none",
      }}
    >
      {inventory.length === 0 ? (
        <div style={{ color: "#aaa", fontSize: 12, writingMode: "vertical-rl" }}>Empty</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {inventory.map((item) => {
            const img = ITEM_IMAGE[item.id];
            return (
              <div
                key={item.id}
                onClick={() => openDrop(item)}
                title={item.name}
                style={{
                  position: "relative",
                  width: 44,
                  height: 44,
                  borderRadius: 6,
                  cursor: "pointer",
                  background: "#fff",
                  border: "1px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {img ? (
                  <img
                    src={img}
                    alt={item.name}
                    style={{ width: 36, height: 36, objectFit: "contain" }}
                  />
                ) : (
                  <span
                    style={{ fontSize: 10, textAlign: "center", padding: 2 }}
                  >
                    {item.name}
                  </span>
                )}
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 4,
                    fontSize: 10,
                    color: "#000000",
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  {item.number}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ドロップ数量選択UI */}
      {selected && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            right: 70,
            transform: "translateY(-50%)",
            padding: "12px",
            background: "rgba(0,0,0,0.85)",
            borderRadius: 10,
            zIndex: 11,
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
