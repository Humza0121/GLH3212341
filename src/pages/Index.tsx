import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/ProductCard";
import FilterPanel, { FilterCategory } from "@/components/FilterPanel";
import AccessPanel from "@/components/AccessPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import lambChops from "@/assets/lamb-chops.jpg";
import lambRibs from "@/assets/lamb-ribs.jpg";
import chickenBreast from "@/assets/chicken-breast.jpg";
import dairyCheese from "@/assets/dairy-cheese.jpg";
import bakeryBread from "@/assets/bakery-bread.jpg";

/* ---------------- TYPES ---------------- */

interface BasketItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

/* ---------------- HELPERS ---------------- */

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getInitialDarkMode = () =>
  typeof window !== "undefined" &&
  localStorage.getItem("glh_dark_mode") === "true";

const getInitialTextSize = (): "normal" | "large" | "x-large" => {
  if (typeof window === "undefined") return "normal";
  const value = localStorage.getItem("glh_text_size");
  return value === "large" || value === "x-large" ? value : "normal";
};

/* ---------------- DATA ---------------- */

const initialProducts: (Product & { tags: FilterCategory[] })[] = [
  { id: "1", name: "Lamb Chops", price: "£10/kg", image: lambChops, stock: 15, seller: "Greenfield Farm", tags: ["family", "healthy"] },
  { id: "2", name: "Lamb Ribs", price: "£12/kg", image: lambRibs, stock: 8, seller: "Greenfield Farm", tags: ["family", "quick-meal"] },
  { id: "3", name: "Chicken Breast", price: "£6.50/kg", image: chickenBreast, stock: 20, seller: "Valley Poultry", tags: ["budget", "healthy", "quick-meal"] },
  { id: "4", name: "Farmhouse Cheese", price: "£8/kg", image: dairyCheese, stock: 18, seller: "Meadow Dairy", tags: ["family", "healthy"] },
  { id: "5", name: "Sourdough Loaf", price: "£3.50/each", image: bakeryBread, stock: 25, seller: "Village Bakery", tags: ["budget", "family", "quick-meal"] },
];

/* ---------------- COMPONENT ---------------- */

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [products] = useState(initialProducts);
  const [basketCount, setBasketCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCategory[]>([]);
  const [accessOpen, setAccessOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [textSize, setTextSize] = useState(getInitialTextSize);

  const navigate = useNavigate();
  const { toast } = useToast();

  /* -------- INIT -------- */

  useEffect(() => {
    const user = safeParse(localStorage.getItem("glh_current_user"), null);
    setIsLoggedIn(!!user);

    const basket = safeParse<BasketItem[]>(
      localStorage.getItem("glh_basket"),
      []
    );
    setBasketCount(basket.reduce((sum, i) => sum + i.quantity, 0));
  }, []);

  /* -------- ACCESSIBILITY -------- */

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("glh_dark_mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const sizes = {
      normal: "16px",
      large: "20px",
      "x-large": "24px",
    };

    document.documentElement.style.fontSize = sizes[textSize];
    localStorage.setItem("glh_text_size", textSize);
  }, [textSize]);

  /* -------- ACTIONS -------- */

  const handleLogout = () => {
    localStorage.removeItem("glh_current_user");
    setIsLoggedIn(false);
  };

  const handleAddToBasket = (product: Product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const basket = safeParse<BasketItem[]>(
      localStorage.getItem("glh_basket"),
      []
    );

    const existing = basket.find((b) => b.id === product.id);
    const currentQty = existing?.quantity || 0;

    if (currentQty >= product.stock) {
      toast({
        title: "Stock limit reached",
        description: `Only ${product.stock} of ${product.name} available`,
        variant: "destructive",
      });
      return;
    }

    let updated: BasketItem[];

    if (existing) {
      updated = basket.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [
        ...basket,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("glh_basket", JSON.stringify(updated));
    setBasketCount(updated.reduce((sum, i) => sum + i.quantity, 0));

    toast({
      title: "Added to basket",
      description: product.name,
    });
  };

  /* -------- FILTERING -------- */

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((f) => p.tags.includes(f));

    return matchesSearch && matchesFilters;
  });

  /* -------- PREVENT FLICKER -------- */

  if (isLoggedIn === null) return null;

  /* -------- UI -------- */

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />

      <div className="flex flex-1">
        <Sidebar
          isLoggedIn={!!isLoggedIn}
          onLogout={handleLogout}
          onFilterToggle={() => {
            setFilterOpen((v) => !v);
            setAccessOpen(false);
          }}
          onAccessToggle={() => {
            setAccessOpen((v) => !v);
            setFilterOpen(false);
          }}
        />

        <main className="flex-1 p-4 md:p-6">
          <FilterPanel
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
          />

          <AccessPanel
            open={accessOpen}
            onClose={() => setAccessOpen(false)}
            darkMode={darkMode}
            onDarkModeChange={setDarkMode}
            textSize={textSize}
            onTextSizeChange={setTextSize}
          />

          {/* Search */}
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Products */}
          <section>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Popular sellers</h2>
              <Button onClick={() => navigate("/see-all")}>
                See all <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToBasket={handleAddToBasket}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No products found
              </p>
            )}
          </section>

          {/* Basket summary */}
          {basketCount > 0 && (
            <div className="mt-6 p-4 bg-accent rounded-lg">
              🛒 {basketCount} item{basketCount !== 1 ? "s" : ""} in basket
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Index;