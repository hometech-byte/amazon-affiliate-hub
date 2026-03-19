import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";

const CATEGORIES = [
  { label: "Laptops", emoji: "💻", value: "laptops" },
  { label: "Headphones", emoji: "🎧", value: "headphones" },
  { label: "Smart Home", emoji: "🏠", value: "smartHome" },
  { label: "Kitchen", emoji: "🍳", value: "kitchen" },
  { label: "Fashion", emoji: "👗", value: "fashion" },
  { label: "Fitness", emoji: "💪", value: "fitness" },
];

export function CategoryTiles() {
  const navigate = useNavigate();

  return (
    <section id="categories">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Explore Categories
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.value}
            type="button"
            data-ocid="category.tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            onClick={() =>
              navigate({
                to: "/",
                search: { q: undefined, category: cat.value },
              })
            }
            className="bg-card rounded-xl p-4 flex flex-col items-center gap-2 shadow-card hover:shadow-md hover:bg-muted transition-all cursor-pointer border border-transparent hover:border-primary/20"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="text-xs font-semibold text-foreground text-center">
              {cat.label}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
