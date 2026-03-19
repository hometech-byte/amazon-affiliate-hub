import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Category } from "../backend.d";
import { CategoryTiles } from "../components/CategoryTiles";
import { HeroBanner } from "../components/HeroBanner";
import { ProductCard } from "../components/ProductCard";
import { TrendingCard } from "../components/TrendingCard";
import {
  useGetFeaturedProducts,
  useGetProductsByCategory,
  useGetTrendingProducts,
  useSearchProducts,
} from "../hooks/useQueries";

const STATIC_FEATURED = [
  {
    id: BigInt(0),
    title: "Apple MacBook Air 15-inch M3 Chip",
    description: "Supercharged by the M3 chip",
    price: 1099.0,
    originalPrice: 1299.0,
    imageUrl: "/assets/generated/product-laptop.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "laptops",
    badge: "Hot Deal",
    rating: 4.8,
    reviewCount: BigInt(2341),
    isFeatured: true,
    isTrending: false,
    isActive: true,
  },
  {
    id: BigInt(1),
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancellation",
    price: 279.99,
    originalPrice: 349.99,
    imageUrl: "/assets/generated/product-headphones.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "headphones",
    badge: "Prime Deal",
    rating: 4.9,
    reviewCount: BigInt(8920),
    isFeatured: true,
    isTrending: false,
    isActive: true,
  },
  {
    id: BigInt(2),
    title: "Amazon Echo Show 10 Smart Display",
    description: "Smart home hub with Alexa",
    price: 149.99,
    originalPrice: 249.99,
    imageUrl: "/assets/generated/product-smarthome.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "smartHome",
    badge: "Hot Deal",
    rating: 4.6,
    reviewCount: BigInt(5012),
    isFeatured: true,
    isTrending: false,
    isActive: true,
  },
  {
    id: BigInt(3),
    title: "Instant Pot Duo 7-in-1 Pressure Cooker",
    description: "Multi-use programmable cooker",
    price: 59.99,
    originalPrice: 99.99,
    imageUrl: "/assets/generated/product-kitchen.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "kitchen",
    badge: "Hot Deal",
    rating: 4.7,
    reviewCount: BigInt(15340),
    isFeatured: true,
    isTrending: false,
    isActive: true,
  },
];

const STATIC_TRENDING = [
  {
    id: BigInt(4),
    title: "Garmin Forerunner 265 GPS Running Watch",
    description:
      "Advanced running metrics, AMOLED display, all-day health monitoring",
    price: 349.99,
    originalPrice: 449.99,
    imageUrl: "/assets/generated/product-fitness.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "fitness",
    badge: "Hot Deal",
    rating: 4.7,
    reviewCount: BigInt(3210),
    isFeatured: false,
    isTrending: true,
    isActive: true,
  },
  {
    id: BigInt(5),
    title: "Levi's Women's Classic Straight Jeans",
    description:
      "Timeless straight leg fit, stretch denim, multiple washes available",
    price: 39.99,
    originalPrice: 69.99,
    imageUrl: "/assets/generated/product-fashion.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "fashion",
    badge: "Prime Deal",
    rating: 4.5,
    reviewCount: BigInt(6780),
    isFeatured: false,
    isTrending: true,
    isActive: true,
  },
  {
    id: BigInt(6),
    title: 'Samsung 65" 4K QLED Smart TV',
    description: "Quantum HDR, built-in Alexa, 120Hz motion",
    price: 897.99,
    originalPrice: 1199.99,
    imageUrl: "/assets/generated/product-smarthome.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "smartHome",
    badge: "Hot Deal",
    rating: 4.8,
    reviewCount: BigInt(4220),
    isFeatured: false,
    isTrending: true,
    isActive: true,
  },
  {
    id: BigInt(7),
    title: "Bose QuietComfort 45 Bluetooth Headphones",
    description: "High-fidelity audio, TriPort acoustic architecture",
    price: 229.0,
    originalPrice: 329.0,
    imageUrl: "/assets/generated/product-headphones.dim_400x400.jpg",
    affiliateUrl: "https://amazon.com",
    category: "headphones",
    badge: "Prime Deal",
    rating: 4.6,
    reviewCount: BigInt(9870),
    isFeatured: false,
    isTrending: true,
    isActive: true,
  },
];

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-card p-4 space-y-3">
      <Skeleton className="h-48 w-full rounded" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function HomePage() {
  const search = useSearch({ from: "/layout/" }) as {
    q?: string;
    category?: string;
  };
  const searchQuery = search.q || "";
  const categoryFilter = search.category ? (search.category as Category) : null;

  const featuredQuery = useGetFeaturedProducts();
  const trendingQuery = useGetTrendingProducts();
  const searchResultsQuery = useSearchProducts(searchQuery);
  const categoryQuery = useGetProductsByCategory(categoryFilter);

  const featuredProducts = featuredQuery.data?.length
    ? featuredQuery.data
    : STATIC_FEATURED;
  const trendingProducts = trendingQuery.data?.length
    ? trendingQuery.data
    : STATIC_TRENDING;

  const isSearching = !!searchQuery;
  const isFiltering = !!categoryFilter;
  const searchResults = searchResultsQuery.data || [];
  const categoryResults = categoryQuery.data || [];

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-12">
      {!isSearching && !isFiltering && <HeroBanner />}

      {isSearching && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Search results for &ldquo;{searchQuery}&rdquo;
          </h2>
          {searchResultsQuery.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div
              data-ocid="search.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg">
                No products found for &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {searchResults.map((p, i) => (
                <ProductCard key={p.id.toString()} product={p} index={i + 1} />
              ))}
            </div>
          )}
        </section>
      )}

      {isFiltering && !isSearching && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground capitalize">
            {categoryFilter} Deals
          </h2>
          {categoryQuery.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : categoryResults.length === 0 ? (
            <div
              data-ocid="category.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-5xl mb-4">📦</p>
              <p>No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryResults.map((p, i) => (
                <ProductCard key={p.id.toString()} product={p} index={i + 1} />
              ))}
            </div>
          )}
        </section>
      )}

      {!isSearching && !isFiltering && (
        <>
          <section id="featured-deals">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Featured Deals
              </h2>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                🔥 Updated Today
              </span>
            </div>
            {featuredQuery.isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                  hidden: {},
                }}
              >
                {featuredProducts.slice(0, 4).map((p, i) => (
                  <motion.div
                    key={p.id.toString()}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <ProductCard product={p} index={i + 1} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>

          <CategoryTiles />

          <section id="trending">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Top Trending Picks
              </h2>
              <span className="text-xs font-semibold text-badge-hot bg-badge-hot/10 px-3 py-1 rounded-full">
                📈 Trending Now
              </span>
            </div>
            {trendingQuery.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-lg p-4 flex gap-4">
                    <Skeleton className="w-32 h-32 flex-shrink-0 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-5 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                  hidden: {},
                }}
              >
                {trendingProducts.slice(0, 6).map((p, i) => (
                  <motion.div
                    key={p.id.toString()}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <TrendingCard product={p} index={i + 1} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
