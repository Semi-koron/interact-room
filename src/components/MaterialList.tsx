import { useEffect, useState } from "react";
import supabase from "../util/supabase";

export default function UserMaterial() {
  const [materialName, setMaterialName] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      // ログイン中ユーザーを自動取得
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_data")
        .select(
          `
    item_id,
    material (
      material_name
    )
  `,
        )
        .eq("user_id", user.id)
        .single();

      // materialが配列なので[0]で取得
      if (!error && data) {
        const mat = Array.isArray(data.material)
          ? data.material[0]
          : data.material;
        setMaterialName(mat?.material_name ?? null);
      }
    };

    fetch();
  }, []);

  return <p>あなたが獲得できる素材: {materialName ?? "読み込み中..."}</p>;
}
