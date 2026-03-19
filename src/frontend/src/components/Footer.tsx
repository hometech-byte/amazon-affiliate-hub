const SOCIAL_ICONS = [
  { icon: "📘", label: "Facebook" },
  { icon: "🐦", label: "Twitter" },
  { icon: "📸", label: "Instagram" },
  { icon: "▶️", label: "YouTube" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-footer text-white/80 mt-16">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">D</span>
              </div>
              <span className="font-bold text-white text-lg">DealFinder</span>
            </div>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Your trusted source for the best Amazon affiliate deals. We curate
              the top products across every category so you save time and money.
            </p>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  aria-label={s.label}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-sm"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                "Laptops",
                "Headphones",
                "Smart Home",
                "Kitchen",
                "Fashion",
                "Fitness",
              ].map((c) => (
                <li key={c}>
                  <a href="/" className="hover:text-white transition-colors">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                "Deal Alerts",
                "Price Tracker",
                "Best Sellers",
                "New Arrivals",
              ].map((c) => (
                <li key={c}>
                  <a href="/" className="hover:text-white transition-colors">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">
              Get Deal Alerts
            </h4>
            <p className="text-xs text-white/60 mb-3">
              Subscribe for daily deal updates.
            </p>
            <div className="flex gap-2">
              <input
                data-ocid="newsletter.input"
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary"
              />
              <button
                type="button"
                data-ocid="newsletter.button"
                className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <p className="text-xs text-white/40">
            &copy; {year}. Built with &hearts; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              className="underline hover:text-white/70"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-white/40 text-center">
            As an Amazon Associate, we earn from qualifying purchases. Prices
            and availability are subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}
