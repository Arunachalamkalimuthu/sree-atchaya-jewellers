"use client";
import type { ReactNode } from "react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHead } from "./SectionHead";

/**
 * `<ProductRow id title intro? link? products>`: a row of v2 product tiles. Five across from 1024 px; on phones and
 * tablets a sideways row showing two (three on tablets) at a time.
 */
export function ProductRow({
  id, title, intro, link, products, className = "",
}: { id: string; title: string; intro?: ReactNode; link?: { href: string; label: string }; products: Product[]; className?: string }) {
  return (
    <section aria-labelledby={id} className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 ${className}`}>
      <SectionHead id={id} title={title} intro={intro} link={link} />
      <ul className="no-scrollbar -mx-4 mt-6 grid auto-cols-[calc((100%-2.75rem)/2)] grid-flow-col gap-x-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:auto-cols-[calc((100%-5rem)/3)] sm:gap-x-4 sm:px-6 lg:mx-0 lg:grid-flow-row lg:grid-cols-5 lg:gap-x-5 lg:overflow-visible lg:px-0">
        {products.map((p) => (
          <li key={p.slug} className="min-w-0">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
