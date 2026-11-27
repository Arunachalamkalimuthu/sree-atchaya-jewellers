/** Every internal link goes through here (static export: ids of browser-created records use ?id=). */
import type { CategoryId } from "./catalog";

const q = (id: string) => `?id=${encodeURIComponent(id)}`;

export const routes = {
  home: () => "/",
  shop: (cat?: CategoryId) => (cat ? `/shop/?c=${cat}` : "/shop/"),
  product: (slug: string) => `/product/${slug}/`,
  custom: () => "/custom-order/",
  sellGold: () => "/sell-gold/",
  scheme: () => "/scheme/",
  schemeJoin: (plan: "monthly" | "digi") => `/scheme/join/?plan=${plan}`,
  cart: () => "/cart/",
  checkout: () => "/checkout/",
  order: (id: string) => `/order/${q(id)}`,
  account: () => "/account/",
  app: {
    home: () => "/app/",
    shop: (cat?: CategoryId) => (cat ? `/app/shop/?c=${cat}` : "/app/shop/"),
    product: (slug: string) => `/app/product/${slug}/`,
    scheme: () => "/app/scheme/",
    orders: () => "/app/orders/",
    order: (id: string) => `/app/orders/view/${q(id)}`,
    profile: () => "/app/profile/",
  },
};
