import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/catalog";
import { ProductScreen } from "@/components/app/ProductScreen";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProduct(slug)?.name.en ?? "App" };
}

export default async function AppProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProduct(slug)) notFound();
  return (
    <Suspense fallback={null}>
      <ProductScreen slug={slug} />
    </Suspense>
  );
}
