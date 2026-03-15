import type { InventoryItem } from "../hooks/useSocket";

interface Props {
  inventory: InventoryItem[];
}

export function InventoryPanel({ inventory }: Props) {
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
        pointerEvents: "none",
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
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "2px 0",
              }}
            >
              <span>{item.name}</span>
              <span style={{ color: "#ffcc00" }}>x{item.number}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
