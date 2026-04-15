import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */
interface BasketItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface User {
  email: string;
  name?: string;
  loyaltyPoints?: number;
}

/* ---------------- HELPERS ---------------- */

// Safe JSON parse
const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// Extract number from "£10/kg"
const parsePrice = (price: string): number => {
  const match = price.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
};

// Stock limits
const stockLimits: Record<string, number> = {
  "1": 15,
  "2": 8,
  "3": 20,
  "4": 18,
  "5": 25,
};

/* ---------------- COMPONENT ---------------- */

const Basket = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [items, setItems] = useState<BasketItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  /* -------- INITIAL LOAD -------- */
  useEffect(() => {
    const user = safeParse<User | null>(
      localStorage.getItem("glh_current_user"),
      null
    );

    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    setIsLoggedIn(true);

    const saved = safeParse<BasketItem[]>(
      localStorage.getItem("glh_basket"),
      []
    );
    setItems(saved);
  }, [navigate]);

  /* -------- HELPERS -------- */

  const persist = (updated: BasketItem[]) => {
    setItems(updated);
    localStorage.setItem("glh_basket", JSON.stringify(updated));
  };

  const updateQuantity = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    // Stock limit check
    if (delta > 0 && stockLimits[id] && item.quantity >= stockLimits[id]) {
      toast({
        title: "Stock limit reached",
        description: `Only ${stockLimits[id]} available`,
        variant: "destructive",
      });
      return;
    }

    const updated = items
      .map((i) =>
        i.id === id
          ? { ...i, quantity: Math.max(0, i.quantity + delta) }
          : i
      )
      .filter((i) => i.quantity > 0);

    persist(updated);
  };

  const removeItem = (id: string) => {
    persist(items.filter((item) => item.id !== id));
  };

  const clearBasket = () => persist([]);

  /* -------- DERIVED VALUES -------- */

  const total = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  /* -------- CHECKOUT -------- */

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Basket empty",
        description: "Add items before checking out.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Orders
      const existingOrders = safeParse<any[]>(
        localStorage.getItem("glh_orders"),
        []
      );

      const newOrders = items.flatMap((item) =>
        Array.from({ length: item.quantity }).map(() => ({
          id: crypto.randomUUID(),
          productId: item.id,
          name: item.name,
          price: item.price,
          date: new Date().toISOString(),
        }))
      );

      localStorage.setItem(
        "glh_orders",
        JSON.stringify([...existingOrders, ...newOrders])
      );

      // 2. Update user points
      const user = safeParse<User | null>(
        localStorage.getItem("glh_current_user"),
        null
      );

      if (!user?.email) throw new Error("Invalid user");

      const updatedPoints = (user.loyaltyPoints || 0) + itemCount;

      const updatedUser = { ...user, loyaltyPoints: updatedPoints };

      localStorage.setItem(
        "glh_current_user",
        JSON.stringify(updatedUser)
      );

      // 3. Sync users array
      const users = safeParse<User[]>(
        localStorage.getItem("glh_users"),
        []
      );

      const updatedUsers = users.map((u) =>
        u.email === user.email
          ? { ...u, loyaltyPoints: updatedPoints }
          : u
      );

      localStorage.setItem("glh_users", JSON.stringify(updatedUsers));

      // 4. Clear + redirect
      clearBasket();
      navigate("/orders");
    } catch (err) {
      toast({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  /* -------- LOGOUT -------- */

  const handleLogout = () => {
    localStorage.removeItem("glh_current_user");
    setIsLoggedIn(false);
    navigate("/");
  };

  /* -------- PREVENT FLICKER -------- */

  if (isLoggedIn === null) return null;

  /* -------- UI -------- */

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />

      <div className="flex flex-1">
        <Sidebar isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />

        <main className="flex-1 p-4 md:p-6" role="main">
          <h1 className="font-display text-2xl font-bold mb-6">
            Your Basket
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-2">
                Your basket is empty
              </p>
              <Button onClick={() => navigate("/")}>
                Browse products
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* ITEMS */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border rounded-lg p-4 flex items-center gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold truncate">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold text-sm">
                        {item.price}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.id, -1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>

                      <span className="w-8 text-center">
                        {item.quantity}
                      </span>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.id, 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold">
                        £
                        {(
                          parsePrice(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}
              <div className="bg-card border rounded-lg p-6 h-fit sticky top-4">
                <h2 className="font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        £
                        {(
                          parsePrice(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total ({itemCount} items)</span>
                  <span>£{total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={clearBasket}
                >
                  Clear basket
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Basket;