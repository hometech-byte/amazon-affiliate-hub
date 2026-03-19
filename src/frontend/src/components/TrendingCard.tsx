import { Button } from "@/components/ui/button";
import type { Product } from "../backend.d";
import { StarRating } from "./StarRating";

const FALLBACK_IMAGES: Record<string, string> = {
  laptops: "/assets/generated/product-laptop.dim_400x400.jpg",
  headphones: "/assets/generated/product-headphones.dim_400x400.jpg",
  smartHome: "/assets/generated/product-smarthome.dim_400x400.jpg",
  kitchen: "/assets/generated/product-kitchen.dim_400x400.jpg",
  fitness: "/assets/generated/product-fitness.dim_400x400.jpg",
  fashion: "/assets/generated/product-fashion.dim_400x400.jpg",
};

interface TrendingCardProps {
  product: Product;
  index: number;
}

export function TrendingCard({ product, index }: TrendingCardProps) {
  const imageUrl =
    product.imageUrl ||
    FALLBACK_IMAGES[product.category] ||
    FALLBACK_IMAGES.laptops;

  return (
    <div
      data-ocid={`trending.item.${index}`}
      className="bg-card rounded-lg shadow-card overflow-hidden flex flex-row hover:shadow-md transition-shadow"
    >
      <div className="relative flex-shrink-0 w-32">
        {product.badge && (
          <span
            className={`absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 py-0.5 rounded-full ${
              product.badge.toLowerCase().includes("prime")
                ? "bg-badge-prime"
                : "bg-badge-hot"
            }`}
          >
            {product.badge}
          </span>
        )}
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-contain p-2 bg-white"
          style={{ minHeight: "120px" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.laptops;
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-1 justify-between">
        <div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground mb-1">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
          <div className="flex flex-col gap-0.5">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <Button
            data-ocid={`trending.button.${index}`}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold tracking-wider"
            onClick={() =>
              window.open(product.affiliateUrl, "_blank", "noopener,noreferrer")
            }
          >
            VIEW ON AMAZON
          </Button>
        </div>
      </div>
    </div>
  );
}
