import { RateBoard } from "@/components/site/RateBar";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS } from "@/lib/catalog";

// Placeholder home until Task 5 builds the real one: the rate board and a few pieces.
export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <RateBoard />
      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}
