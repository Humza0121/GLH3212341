import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type User = {
  email: string;
  name: string;
  loyaltyPoints?: number;
};

const safeParse = (value: string | null, fallback: any) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user: User = safeParse(localStorage.getItem("glh_current_user"), null);

    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    setIsLoggedIn(true);
    setEmail(user.email);
    setName(user.name || "");
    setLoyaltyPoints(user.loyaltyPoints || 0);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("glh_current_user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Invalid name",
        description: "Display name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const user: User = safeParse(localStorage.getItem("glh_current_user"), {});
      if (!user.email) throw new Error("Invalid user");

      const updatedUser = { ...user, name };

      localStorage.setItem("glh_current_user", JSON.stringify(updatedUser));

      // Update users list
      const users: User[] = safeParse(localStorage.getItem("glh_users"), []);

      const updatedUsers = users.map((u) =>
        u.email === user.email ? { ...u, name } : u
      );

      localStorage.setItem("glh_users", JSON.stringify(updatedUsers));

      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Prevent UI flicker before auth check completes
  if (isLoggedIn === null) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />
        <main className="flex-1 p-4 md:p-6" role="main">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">
            Account Settings
          </h1>

          <div className="max-w-lg space-y-6">
            <div className="bg-accent rounded-lg border border-border p-4">
              <p className="font-body text-sm text-foreground">
                🌟 <strong>Loyalty Points:</strong> {loyaltyPoints}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <div>
                <Label htmlFor="account-name">Display Name</Label>
                <Input
                  id="account-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="account-email">Email</Label>
                <Input
                  id="account-email"
                  value={email}
                  disabled
                  className="mt-1 opacity-60"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed.
                </p>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Account;