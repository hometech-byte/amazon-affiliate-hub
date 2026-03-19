import { Button } from "@/components/ui/button";
import type { Product } from "../backend.d";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
  index: number;
}

const FALLBACK_IMAGES: Record<string, string> = {
  laptops: "/assets/generated/product-laptop.dim_400x400.jpg",
  headphones: "/assets/generated/product-headphones.dim_400x400.jpg",
  smartHome: "/assets/generated/product-smarthome.dim_400x400.jpg",
  kitchen: "/assets/generated/product-kitchen.dim_400x400.jpg",
  fitness: "/assets/generated/product-fitness.dim_400x400.jpg",
  fashion: "/assets/generated/product-fashion.dim_400x400.jpg",
};

export function ProductCard({ product, index }: ProductCardProps) {
  const imageUrl =
    product.imageUrl ||
    FALLBACK_IMAGES[product.category] ||
    FALLBACK_IMAGES.laptops;

  return (
    <div
      data-ocid={`featured.item.${index}`}
      className="bg-card rounded-lg shadow-card overflow-hidden flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="relative">
        {product.badge && (
          <span
            className={`absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 py-1 rounded-full ${
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
          className="w-full h-48 object-contain p-4 bg-white"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.laptops;
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
          {product.title}
        </h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button
          data-ocid={`featured.button.${index}`}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold tracking-wider"
          onClick={() =>
            window.open(product.affiliateUrl, "_blank", "noopener,noreferrer")
          }
        >
          VIEW ON AMAZON
        </Button>
      </div>
    </div>
  );
}
