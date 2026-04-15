import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */

type Category = "all" | "meat" | "dairy" | "bakery";

interface BasketItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CategorisedProduct extends Product {
  category: Category;
}

/* ---------------- HELPERS ---------------- */

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

/* ---------------- DATA ---------------- */

const allProducts: CategorisedProduct[] = [
  { id: "1", name: "Lamb Chops", price: "£10/kg", image: "/assets/lamb-chops.jpg", stock: 15, seller: "Greenfield Farm", category: "meat" },
  { id: "2", name: "Lamb Ribs", price: "£12/kg", image: "/assets/lamb-ribs.jpg", stock: 8, seller: "Greenfield Farm", category: "meat" },
  { id: "3", name: "Chicken Breast", price: "£6.50/kg", image: "/assets/chicken-breast.jpg", stock: 20, seller: "Valley Poultry", category: "meat" },
  { id: "4", name: "Beef Steak", price: "£14/kg", image: "/assets/beef-steak.jpg", stock: 12, seller: "Hilltop Cattle", category: "meat" },
  { id: "5", name: "Pork Sausages", price: "£5/pack", image: "/assets/pork-sausages.jpg", stock: 30, seller: "Oakwood Farm", category: "meat" },
  { id: "6", name: "Beef Mince", price: "£7/kg", image: "/assets/beef-mince.jpg", stock: 22, seller: "Hilltop Cattle", category: "meat" },

  { id: "7", name: "Farmhouse Cheese", price: "£8/kg", image: "/assets/dairy-cheese.jpg", stock: 18, seller: "Meadow Dairy", category: "dairy" },
  { id: "8", name: "Whole Milk", price: "£1.50/litre", image: "/assets/dairy-milk.jpg", stock: 40, seller: "Meadow Dairy", category: "dairy" },
  { id: "9", name: "Farm Butter", price: "£3/block", image: "/assets/dairy-butter.jpg", stock: 25, seller: "Meadow Dairy", category: "dairy" },
  { id: "10", name: "Natural Yogurt", price: "£2/pot", image: "/assets/dairy-yogurt.jpg", stock: 35, seller: "Riverside Dairy", category: "dairy" },
  { id: "11", name: "Free Range Eggs", price: "£2.50/dozen", image: "/assets/dairy-eggs.jpg", stock: 50, seller: "Sunrise Hens", category: "dairy" },
  { id: "12", name: "Fresh Cream", price: "£1.80/jug", image: "/assets/dairy-cream.jpg", stock: 20, seller: "Riverside Dairy", category: "dairy" },

  { id: "13", name: "Sourdough Loaf", price: "£3.50/each", image: "/assets/bakery-bread.jpg", stock: 25, seller: "Village Bakery", category: "bakery" },
  { id: "14", name: "Butter Croissants", price: "£4/pack", image: "/assets/bakery-croissant.jpg", stock: 20, seller: "Village Bakery", category: "bakery" },
  { id: "15", name: "Fruit Scones", price: "£3/pack", image: "/assets/bakery-scones.jpg", stock: 18, seller: "Village Bakery", category: "bakery" },
  { id: "16", name: "French Baguette", price: "£2.50/each", image: "/assets/bakery-baguette.jpg", stock: 15, seller: "Artisan Bakes", category: "bakery" },
  { id: "17", name: "Berry Fruit Pie", price: "£5/each", image: "/assets/bakery-pie.jpg", stock: 10, seller: "Artisan Bakes", category: "bakery" },
  { id: "18", name: "Chocolate Muffins", price: "£3.50/pack", image: "/assets/bakery-muffins.jpg", stock: 22, seller: "Artisan Bakes", category: "bakery" },
];

const categoryLabels: Record<Category, string> = {
  all: "All Products",
  meat: "Meat",
  dairy: "Dairy",
  bakery: "Bakery & Bread",
};

/* ---------------- COMPONENT ---------------- */

const SeeAll = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* -------- INIT -------- */

  useEffect(() => {
    const user = safeParse(localStorage.getItem("glh_current_user"), null);
    setIsLoggedIn(!!user);

    const cat = searchParams.get("category");
    if (cat && (["all", "meat", "dairy", "bakery"] as string[]).includes(cat)) {
      setActiveCategory(cat as Category);
    }
  }, [searchParams]);

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

    toast({
      title: "Added to basket",
      description: product.name,
    });
  };

  /* -------- FILTER -------- */

  const filtered =
    activeCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  /* -------- PREVENT FLICKER -------- */

  if (isLoggedIn === null) return null;

  /* -------- UI -------- */

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />

      <div className="flex flex-1">
        <Sidebar isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />

        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">
            Browse Products
          </h1>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(categoryLabels) as Category[]).map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
              >
                {categoryLabels[cat]}
              </Button>
            ))}
          </div>

          {/* Products */}
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
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SeeAll;