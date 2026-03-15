import { create } from "zustand";

export interface RoomObject {
  id: string;
  modelUrl: string;
  label: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

interface RoomEditorState {
  objects: RoomObject[];
  selectedId: string | null;
  editMode: "translate" | "rotate";
  placingModel: { modelUrl: string; label: string } | null;

  addObject: (obj: RoomObject) => void;
  removeObject: (id: string) => void;
  setObjectPos: (id: string, pos: [number, number, number]) => void;
  setObjectRot: (id: string, rot: [number, number, number]) => void;
  setSelectedId: (id: string | null) => void;
  setEditMode: (mode: "translate" | "rotate") => void;
  setPlacingModel: (model: { modelUrl: string; label: string } | null) => void;
}

export const useRoomEditorStore = create<RoomEditorState>((set) => ({
  objects: [],
  selectedId: null,
  editMode: "translate",
  placingModel: null,

  addObject: (obj) =>
    set((state) => ({ objects: [...state.objects, obj] })),
  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((o) => o.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  setObjectPos: (id, pos) =>
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id === id ? { ...o, position: pos } : o,
      ),
    })),
  setObjectRot: (id, rot) =>
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id === id ? { ...o, rotation: rot } : o,
      ),
    })),
  setSelectedId: (id) => set({ selectedId: id }),
  setEditMode: (mode) => set({ editMode: mode }),
  setPlacingModel: (model) => set({ placingModel: model, selectedId: null }),
}));

/** public/funiture 配下の家具一覧 */
export const FURNITURE_MODELS = [
  { modelUrl: "/funiture/chiar.glb", label: "椅子" },
  { modelUrl: "/funiture/sofa.glb", label: "ソファ" },
  { modelUrl: "/funiture/stonetable.glb", label: "石テーブル" },
  { modelUrl: "/funiture/woodtable.glb", label: "木テーブル" },
] as const;
