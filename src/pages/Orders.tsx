import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

/* ---------------- TYPES ---------------- */

interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  price: string;
  date: string;
}

/* ---------------- HELPERS ---------------- */

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

/* ---------------- COMPONENT ---------------- */

const Orders = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const navigate = useNavigate();

  /* -------- INIT -------- */

  useEffect(() => {
    const user = safeParse(localStorage.getItem("glh_current_user"), null);

    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    setIsLoggedIn(true);

    const savedOrders = safeParse<OrderItem[]>(
      localStorage.getItem("glh_orders"),
      []
    );

    // Filter + validate + sort newest first
    const validOrders = savedOrders
      .filter(
        (o) =>
          o &&
          typeof o.id === "string" &&
          typeof o.name === "string" &&
          typeof o.price === "string" &&
          typeof o.date === "string"
      )
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    setOrders(validOrders);
  }, [navigate]);

  /* -------- ACTIONS -------- */

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
            Your Orders
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">
                No orders yet
              </p>
              <p className="text-muted-foreground text-sm">
                Items you purchase will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">
                      {order.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <p className="font-bold text-primary">
                    {order.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;