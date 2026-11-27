/** Which products the home page shows where. Photo-first, so a row never leads with an empty tile. */
import { CATEGORIES, PRODUCTS, type CategoryId, type Product } from "@/lib/catalog";
import { hasImage } from "@/lib/images";

const photoFirst = (list: Product[]) => [...list].sort((a, b) => Number(hasImage(b.image)) - Number(hasImage(a.image)));

/** One representative piece per category (the first with a photo), for the round category thumbnails. */
export const CATEGORY_COVERS: { id: CategoryId; en: string; ta: string; product?: Product }[] = CATEGORIES.map((c) => ({
  ...c,
  product: photoFirst(PRODUCTS.filter((p) => p.category === c.id))[0],
}));

/** Five new pieces, one per category first so the row varies. */
export const NEW_ROW: Product[] = (() => {
  const pool = photoFirst(PRODUCTS.filter((p) => p.isNew));
  const seen = new Set<CategoryId>();
  const first = pool.filter((p) => (seen.has(p.category) ? false : (seen.add(p.category), true)));
  return [...first, ...pool.filter((p) => !first.includes(p))].slice(0, 5);
})();

/** Temple and bridal: temple sets, haarams, necklaces and jhumkas not already in the new row. */
export const TEMPLE_BRIDAL_ROW: Product[] = photoFirst(
  PRODUCTS.filter((p) => (["temple", "haaram", "necklace"] as CategoryId[]).includes(p.category) || p.slug === "temple-jhumka").filter(
    (p) => !NEW_ROW.includes(p),
  ),
).slice(0, 5);

/**
 * Six photos for the "From our showroom" strip (one even row on desktop): photographed pieces not shown in the rows
 * above first, topped up from the rows so the strip never has gaps.
 */
export const INSTAGRAM_PICKS: Product[] = (() => {
  const photographed = PRODUCTS.filter((p) => hasImage(p.image));
  const fresh = photographed.filter((p) => !NEW_ROW.includes(p) && !TEMPLE_BRIDAL_ROW.includes(p));
  return [...fresh, ...photographed.filter((p) => !fresh.includes(p))].slice(0, 6);
})();
