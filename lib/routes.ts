/** Every internal link goes through here (static export: ids of browser-created records use ?id=). */
export type CategoryId =
  | "necklace" | "haaram" | "temple" | "bangle" | "chain" | "earring" | "ring" | "coin" | "silver" | "diamond";

const q = (id: string) => `?id=${encodeURIComponent(id)}`;

export const routes = {
  home: () => "/",
  shop: (cat?: CategoryId) => (cat ? `/shop/?cat=${cat}` : "/shop/"),
  product: (slug: string) => `/shop/${slug}/`,
  custom: () => "/custom/",
  sellGold: () => "/sell-gold/",
  scheme: () => "/scheme/",
  schemeJoin: (plan: "monthly" | "digi") => `/scheme/join/?plan=${plan}`,
  cart: () => "/cart/",
  checkout: () => "/checkout/",
  order: (id: string) => `/order/${q(id)}`,
  account: () => "/account/",
  app: {
    home: () => "/app/",
    shop: (cat?: CategoryId) => (cat ? `/app/shop/?cat=${cat}` : "/app/shop/"),
    product: (slug: string) => `/app/shop/${slug}/`,
    scheme: () => "/app/scheme/",
    orders: () => "/app/orders/",
    order: (id: string) => `/app/orders/view/${q(id)}`,
    profile: () => "/app/profile/",
  },
};
