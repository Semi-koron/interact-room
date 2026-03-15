import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import supabase from "../../../util/supabase";
import styles from "./index.module.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

interface Ingredient {
  materialName: string;
  requiredCount: number;
}

interface Recipe {
  id: number;
  name: string;
  imageURL: string | null;
  ingredients: Ingredient[];
}

interface LobbyStatus {
  recipeName: string;
  players: Array<{ socketId: string; materialId: number; materialName: string }>;
  requirements: Array<{ materialId: number; materialName: string; requiredCount: number }>;
  ready: boolean;
}

type Mode = "select" | "waiting";

const CreateFurniture = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  // ロビー関連
  const socketRef = useRef<Socket | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [myMaterialName, setMyMaterialName] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("select");
  const [passphrase, setPassphrase] = useState("");
  const [joinPassphrase, setJoinPassphrase] = useState("");
  const [lobbyStatus, setLobbyStatus] = useState<LobbyStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Supabaseからセッション&自分の素材を取得
  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const token = sessionData.session.access_token;
      setAccessToken(token);

      // 自分の素材を取得
      const userId = sessionData.session.user.id;
      const { data: userData } = await supabase
        .from("user_data")
        .select("item_id, material:item_id ( material_name )")
        .eq("user_id", userId)
        .single();

      if (userData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mat = userData as any;
        setMyMaterialName(mat.material?.material_name ?? `素材#${mat.item_id}`);
      }
    };
    init();
  }, []);

  // レシピ一覧取得
  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipe")
        .select(
          `
          id,
          name,
          imageURL,
          recipe_ingredient (
            required_count,
            material:material_id ( material_name )
          )
        `,
        )
        .order("id");

      if (error) {
        console.error("Failed to fetch recipes:", error);
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: Recipe[] = (data ?? []).map((r: any) => ({
        id: r.id,
        name: r.name,
        imageURL: r.imageURL,
        ingredients: (r.recipe_ingredient ?? []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (ri: any) => ({
            materialName: ri.material?.material_name ?? "不明",
            requiredCount: ri.required_count,
          }),
        ),
      }));

      setRecipes(mapped);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  // Socket接続（ロビー用）
  useEffect(() => {
    if (!accessToken) return;

    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on("lobby:update", (status: LobbyStatus) => {
      setLobbyStatus(status);
    });

    socket.on("game:start", (data: { roomId: string }) => {
      socket.disconnect();
      navigate(`/game/${data.roomId}`);
    });

    return () => {
      socket.emit("lobby:leave");
      socket.disconnect();
    };
  }, [accessToken, navigate]);

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  // 部屋を作成
  const handleCreate = useCallback(() => {
    if (!selectedId || !passphrase.trim() || !socketRef.current) return;
    setError(null);

    socketRef.current.emit(
      "lobby:create",
      { accessToken, recipeId: selectedId, passphrase: passphrase.trim() },
      (res: { ok: boolean; message: string; status?: LobbyStatus }) => {
        if (!res.ok) {
          setError(res.message);
          return;
        }
        if (res.status) setLobbyStatus(res.status);
        setMode("waiting");
      },
    );
  }, [selectedId, passphrase, accessToken]);

  // 合言葉で参加
  const handleJoin = useCallback(() => {
    if (!joinPassphrase.trim() || !socketRef.current) return;
    setError(null);

    socketRef.current.emit(
      "lobby:join",
      { accessToken, passphrase: joinPassphrase.trim() },
      (res: { ok: boolean; message: string; status?: LobbyStatus }) => {
        if (!res.ok) {
          setError(res.message);
          return;
        }
        if (res.status) setLobbyStatus(res.status);
        setMode("waiting");
      },
    );
  }, [joinPassphrase, accessToken]);

  // ロビー退出
  const handleLeave = () => {
    socketRef.current?.emit("lobby:leave");
    setLobbyStatus(null);
    setMode("select");
    setPassphrase("");
    setError(null);
  };

  if (loading) {
    return (
      <div className={styles["page"]}>
        <p>読み込み中...</p>
      </div>
    );
  }

  // --- 待機画面 ---
  if (mode === "waiting") {
    return (
      <div className={styles["page"]}>
        <h1 className={styles["heading"]}>待機中...</h1>

        {myMaterialName && (
          <div className={styles["myMaterial"]}>
            あなたの素材: <strong>{myMaterialName}</strong>
          </div>
        )}

        {lobbyStatus && (
          <div className={styles["waitingBox"]}>
            <h2>{lobbyStatus.recipeName}</h2>

            <div className={styles["statusSection"]}>
              <h3>参加者 ({lobbyStatus.players.length}人)</h3>
              <ul className={styles["statusList"]}>
                {lobbyStatus.players.map((p, i) => (
                  <li key={p.socketId}>
                    プレイヤー{i + 1} — {p.materialName}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles["statusSection"]}>
              <h3>必要な素材</h3>
              <ul className={styles["statusList"]}>
                {lobbyStatus.requirements.map((req) => {
                  const have = lobbyStatus.players.filter(
                    (p) => p.materialId === req.materialId,
                  ).length;
                  const met = have >= req.requiredCount;
                  return (
                    <li
                      key={req.materialId}
                      className={met ? styles["met"] : styles["unmet"]}
                    >
                      {req.materialName}: {have}/{req.requiredCount}人{" "}
                      {met ? "✓" : ""}
                    </li>
                  );
                })}
              </ul>
            </div>

            {lobbyStatus.ready && (
              <div className={styles["readyMsg"]}>
                全員揃いました！ゲーム開始中...
              </div>
            )}
          </div>
        )}

        {error && <div className={styles["errorMsg"]}>{error}</div>}

        <button className={styles["leaveButton"]} onClick={handleLeave}>
          退出する
        </button>
      </div>
    );
  }

  // --- レシピ選択画面 ---
  return (
    <div className={styles["page"]}>
      <h1 className={styles["heading"]}>レシピ一覧</h1>

      {myMaterialName && (
        <div className={styles["myMaterial"]}>
          あなたの素材: <strong>{myMaterialName}</strong>
        </div>
      )}

      {/* 合言葉で参加セクション */}
      <div className={styles["joinSection"]}>
        <input
          className={styles["joinInput"]}
          type="text"
          placeholder="合言葉を入力して参加"
          value={joinPassphrase}
          onChange={(e) => setJoinPassphrase(e.target.value)}
        />
        <button
          className={styles["joinButton"]}
          onClick={handleJoin}
          disabled={!joinPassphrase.trim() || !accessToken}
        >
          参加する
        </button>
      </div>

      {error && <div className={styles["errorMsg"]}>{error}</div>}

      <div className={styles["grid"]}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`${styles["card"]} ${selectedId === recipe.id ? styles["selected"] : ""}`}
            onClick={() => handleSelect(recipe.id)}
            role="button"
            aria-pressed={selectedId === recipe.id}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSelect(recipe.id)}
          >
            {recipe.imageURL && (
              <img
                src={recipe.imageURL}
                alt={recipe.name}
                className={styles["image"]}
              />
            )}
            <div className={styles["body"]}>
              <h2 className={styles["name"]}>{recipe.name}</h2>
              {recipe.ingredients.length > 0 && (
                <div className={styles["ingredients"]}>
                  <p className={styles["ingredientsTitle"]}>必要な材料</p>
                  <ul className={styles["ingredientList"]}>
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className={styles["ingredientItem"]}>
                        {ing.materialName}
                        <span className={styles["ingredientCount"]}>
                          ×{ing.requiredCount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles["footer"]}>
        <Link to="/" className={styles["link"]}>
          戻る
        </Link>
        <div className={styles["footerActions"]}>
          {selectedId && (
            <>
              <div className={styles["passphraseInput"]}>
                <input
                  type="text"
                  placeholder="合言葉"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className={styles["footerInput"]}
                />
                <button
                  className={styles["createButton"]}
                  onClick={handleCreate}
                  disabled={!passphrase.trim() || !accessToken}
                >
                  部屋を作る
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFurniture;
