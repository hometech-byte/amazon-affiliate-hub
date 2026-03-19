import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function HeroBanner() {
  return (
    <section
      className="bg-hero rounded-xl overflow-hidden relative"
      style={{ minHeight: "340px" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-products.dim_1200x500.jpg')",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-hero-cta font-semibold text-sm tracking-widest uppercase mb-2">
            🔥 Today's Best Deals
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Discover Today's Best
            <br />
            Amazon Deals
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Handpicked affiliate deals across tech, home, fashion, fitness &
            more — updated daily.
          </p>
          <Button
            data-ocid="hero.primary_button"
            size="lg"
            className="bg-hero-cta hover:bg-hero-cta/90 text-white font-bold px-8 py-3 text-base"
            onClick={() =>
              document
                .getElementById("featured-deals")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Shop All Deals
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
