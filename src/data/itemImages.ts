const BASE = "/images";
const RECIPE = `${BASE}/recipe`;

/** itemId → 通常画像パス (直接採取・素材) */
export const ITEM_IMAGE: Record<number, string> = {
  101: `${BASE}/wood.png`,
  102: `${BASE}/stone.png`,
  103: `${BASE}/sand.png`,
  104: `${BASE}/cotton-flower.png`,
  105: `${BASE}/iron-ore.png`,
  201: `${BASE}/wooden-stick.png`,
  202: `${BASE}/wooden-board.png`,
  203: `${BASE}/coal.png`,
  204: `${BASE}/stone-material.png`,
  205: `${BASE}/glass.png`,
  206: `${BASE}/cloth.png`,
  207: `${BASE}/cotton.png`,
  208: `${BASE}/iron-ingot.png`,
  209: `${BASE}/iron-nail.png`,
  301: `${BASE}/wooden-table.png`,
  303: `${BASE}/chair.png`,
  304: `${BASE}/sofa.png`,
  305: `${BASE}/bed.png`,
  306: `${BASE}/book-shelf.png`,
  307: `${BASE}/curtain.png`,
  308: `${BASE}/window.png`,
  309: `${BASE}/door.png`,
  310: `${BASE}/shelf.png`,
  311: `${BASE}/vase.png`,
  312: `${BASE}/tile-carpet.png`,
  901: `${BASE}/axe.png`,
  902: `${BASE}/pickel.png`,
  903: `${BASE}/budket.png`,
};

/** itemId → レシピ画像パス (素材が必要な加工品) */
export const ITEM_RECIPE_IMAGE: Record<number, string> = {
  201: `${RECIPE}/to-wooden-stick.png`,
  202: `${RECIPE}/to-wooden-board.png`,
  203: `${RECIPE}/to-coal.png`,
  204: `${RECIPE}/to-stone-material.png`,
  205: `${RECIPE}/to-glass.png`,
  206: `${RECIPE}/to-cloth.png`,
  207: `${RECIPE}/to-cotton.png`,
  208: `${RECIPE}/to-iron-ingot.png`,
  209: `${RECIPE}/to-iron-nail.png`,
  301: `${RECIPE}/to-wooden-table.png`,
  302: `${RECIPE}/to-stone-table.png`,
  303: `${RECIPE}/to-chair.png`,
  304: `${RECIPE}/to-sofa.png`,
  305: `${RECIPE}/to-bed.png`,
  306: `${RECIPE}/to-book-shelf.png`,
  307: `${RECIPE}/to-curtain.png`,
  308: `${RECIPE}/to-window.png`,
  309: `${RECIPE}/to-door.png`,
  310: `${RECIPE}/to-shelf.png`,
  311: `${RECIPE}/to-vase.png`,
  312: `${RECIPE}/to-carpet-tile.png`,
  901: `${RECIPE}/to-axe.png`,
  902: `${RECIPE}/to-pickel.png`,
};

/**
 * processの内容から適切な画像URLを返す
 * consumeItemIds が空 → 直接採取 → 通常画像
 * consumeItemIds あり → 素材消費 → レシピ画像（なければ通常画像）
 */
export function getProcessImage(
  getItemIds: number[],
  consumeItemIds: number[],
  requireItemIds: number[] = [],
): string | null {
  const itemId = getItemIds[0];
  if (itemId == null) return null;

  if (consumeItemIds.length > 0 || requireItemIds.length > 0) {
    return ITEM_RECIPE_IMAGE[itemId] ?? ITEM_IMAGE[itemId] ?? null;
  }
  return ITEM_IMAGE[itemId] ?? null;
}
