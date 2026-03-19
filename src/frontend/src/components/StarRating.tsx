interface StarRatingProps {
  rating: number;
  reviewCount?: bigint;
  size?: "sm" | "md";
}

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const partial = !filled && i < rating;
    return { filled, partial, index: i };
  });

  const iconSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => (
          <span
            key={star.index}
            className={`${iconSize} ${
              star.filled || star.partial
                ? "text-star"
                : "text-muted-foreground"
            }`}
          >
            {star.filled || star.partial ? "★" : "☆"}
          </span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">
          ({reviewCount.toString()})
        </span>
      )}
    </div>
  );
}
