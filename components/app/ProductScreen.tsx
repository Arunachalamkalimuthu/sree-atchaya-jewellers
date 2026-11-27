"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, getProduct } from "@/lib/catalog";
import { asset } from "@/lib/asset";
import { routes } from "@/lib/routes";
import { useL10n } from "@/lib/i18n";
import { BuyBox } from "@/components/shop/BuyBox";
import { AppHeader } from "./AppHeader";
import { useFramed } from "./frame";
import { AppPhoto } from "./AppPhoto";
import { useHasPhoto } from "./photos";

/**
 * The app product screen: the photo on white, then the compact BuyBox with the live price breakdown.
 * Buy now / Pre-book add to the shared cart and open the website's cart (no app checkout in this demo).
 * Inside the desktop phone frame, BuyBox's router.push would keep the cart inside the phone, so it is pointed at
 * this screen with ?to=cart, which hands the cart to the top window.
 */
export function ProductScreen({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const l = useL10n();
  const framed = useFramed();
  const has = useHasPhoto();
  const router = useRouter();
  const toCart = useSearchParams().get("to") === "cart";

  useEffect(() => {
    if (!toCart) return;
    if (framed && window.top) window.top.location.assign(asset(routes.cart()));
    else router.replace(routes.cart());
  }, [toCart, framed, router]);

  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  return (
    <>
      <AppHeader title={l(cat)} back={routes.app.shop(p.category)} />
      <main className="mx-auto w-full max-w-xl pb-10">
        {/* Unshot pieces get a shorter grey band, so the screen does not open on a large empty square. */}
        <AppPhoto src={p.image} alt={l(p.name)} kind={p.category} iconSize={64} className={`w-full border-b border-[#ECE6DF] ${has(p.image) ? "aspect-square" : "aspect-[16/9]"}`} />
        <div className="px-4 pt-5">
          <BuyBox product={p} compact cartHref={framed ? `${routes.app.product(slug)}?to=cart` : routes.cart()} />
        </div>
      </main>
    </>
  );
}
