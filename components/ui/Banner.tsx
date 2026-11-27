import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import { hasImage } from "@/lib/images";

export interface BannerProps {
  /** A /images/banners/... path. If it is not in the image manifest, the banner is a warm off-white panel. */
  src: string;
  /** Alt text for the photo, in the current language. Leave "" when the headline already says it all. */
  alt?: string;
  headline: ReactNode;
  /** One line of real detail under the headline. */
  detail?: ReactNode;
  /** One action, usually a `<Button>`. As a function it gets `photo` (true on a photo) to pick the variant. */
  action?: ReactNode | ((photo: boolean) => ReactNode);
  /** Box size, e.g. "h-[460px] lg:h-[540px]" or "aspect-[16/9]". */
  className?: string;
  /** object-position for the photo, e.g. "70% 50%" to keep the jewellery in view on narrow screens. */
  focal?: string;
  /** "hero": the slider (display serif, large). "promo": the 2-up banners (smaller). */
  size?: "hero" | "promo";
  /** Load straight away (first slide). */
  eager?: boolean;
  /** Headline element. Default "h2". */
  as?: "h1" | "h2" | "h3";
  /** Text sits in the page container (full-bleed hero) or with the banner's own padding (promo). Default by size. */
  contained?: boolean;
  /**
   * Text column width. "default" keeps the copy narrow on the calm side (hero 34rem, promo 19rem). "wide" is for
   * longer copy: full width on phones, then hero 40rem or promo 31rem from 640 px up.
   */
  textWidth?: "default" | "wide";
  /** Extra content under the action (rarely needed). */
  children?: ReactNode;
}

/**
 * `<Banner src headline detail? action? />`: a photo with one headline, one line of detail and one action on the photo's
 * calm left side. A dark scrim sits only behind the text (left to right, and bottom up on phones), never over the
 * jewellery. With no photo it is a warm off-white panel with the same text in ink and maroon.
 *
 * `action` may be a function of `photo` so the button can switch variant: `(photo) => <Button variant={photo ? "light" : "maroon"} …/>`.
 */
export function Banner({
  src, alt = "", headline, detail, action, className = "", focal = "50% 50%", size = "promo", eager = false, as: H = "h2", contained, textWidth = "default", children,
}: BannerProps) {
  const photo = hasImage(src);
  const hero = size === "hero";
  const inContainer = contained ?? hero;
  const act = typeof action === "function" ? action(photo) : action;
  const width = textWidth === "wide" ? (hero ? "max-w-none sm:max-w-[40rem]" : "max-w-none sm:max-w-[31rem]") : hero ? "max-w-[34rem]" : "max-w-[19rem]";

  return (
    <div className={`relative isolate overflow-hidden ${photo ? "bg-[#1d0d0b]" : "bg-cream"} ${className}`}>
      {photo && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(src)}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            className="absolute inset-0 -z-10 size-full object-cover"
            style={{ objectPosition: focal }}
          />
          {/* Scrim behind the text only: bottom band on phones, left band from 640px. */}
          <div
            aria-hidden
            className={`absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(20,8,6,.85)_0%,rgba(20,8,6,.6)_40%,rgba(20,8,6,0)_72%)] ${
              hero
                ? "sm:bg-[linear-gradient(to_right,rgba(20,8,6,.72)_0%,rgba(20,8,6,.45)_38%,rgba(20,8,6,0)_62%)]"
                : "sm:bg-[linear-gradient(to_right,rgba(20,8,6,.8)_0%,rgba(20,8,6,.6)_45%,rgba(20,8,6,0)_75%)]"
            }`}
          />
        </>
      )}
      <div className={`flex h-full items-end sm:items-center ${inContainer ? "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" : "px-5 sm:px-8 lg:px-10"}`}>
        <div className={`${width} ${hero ? "pb-14 sm:pb-0" : "pb-6 sm:pb-0"}`}>
          <H
            className={`${
              hero
                ? "font-display text-[2.1rem] leading-[1.05] sm:text-[2.8rem] lg:text-[3.4rem]"
                : "font-sans text-[1.35rem] leading-tight sm:text-[1.6rem]"
            } font-semibold ${photo ? "text-white" : "text-maroon"} [html[lang=ta]_&]:font-sans [html[lang=ta]_&]:leading-snug ${hero ? "[html[lang=ta]_&]:text-[1.6rem] sm:[html[lang=ta]_&]:text-[2.1rem] lg:[html[lang=ta]_&]:text-[2.4rem]" : "[html[lang=ta]_&]:text-[1.2rem] sm:[html[lang=ta]_&]:text-[1.35rem]"}`}
          >
            {headline}
          </H>
          {detail && (
            <p className={`mt-3 ${hero ? "text-[15px] sm:text-[17px]" : "text-[14.5px] sm:text-[15px]"} leading-relaxed ${photo ? "text-white/88" : "text-mute"}`}>
              {detail}
            </p>
          )}
          {act && <div className={hero ? "mt-6" : "mt-4"}>{act}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}
