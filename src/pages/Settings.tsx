import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

/* ---------------- TYPES ---------------- */

type TextSize = "normal" | "large" | "x-large";

/* ---------------- HELPERS ---------------- */

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

/* ---------------- COMPONENT ---------------- */

const Settings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() =>
    localStorage.getItem("glh_dark_mode") === "true"
  );

  const [textSize, setTextSize] = useState<TextSize>(() => {
    const saved = localStorage.getItem("glh_text_size") as TextSize | null;
    return saved || "normal";
  });

  const [notifications, setNotifications] = useState<boolean>(() =>
    localStorage.getItem("glh_notifications") !== "false"
  );

  const navigate = useNavigate();

  /* -------- AUTH CHECK -------- */

  useEffect(() => {
    const user = safeParse(localStorage.getItem("glh_current_user"), null);

    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    setIsLoggedIn(true);
  }, [navigate]);

  /* -------- APPLY SETTINGS -------- */

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("glh_dark_mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const sizes: Record<TextSize, string> = {
      normal: "16px",
      large: "20px",
      "x-large": "24px",
    };

    document.documentElement.style.fontSize = sizes[textSize];
    localStorage.setItem("glh_text_size", textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem("glh_notifications", String(notifications));
  }, [notifications]);

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
          <h1 className="text-2xl font-bold mb-6">
            Settings
          </h1>

          <div className="max-w-lg space-y-6">
            {/* Appearance */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">
                Appearance
              </h2>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>

                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              {/* Text Size */}
              <div>
                <Label className="mb-2 block">
                  Text Size
                </Label>

                <div className="flex gap-2">
                  {(["normal", "large", "x-large"] as TextSize[]).map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      variant={textSize === size ? "default" : "outline"}
                      onClick={() => setTextSize(size)}
                    >
                      A
                    </Button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Current:{" "}
                  {textSize === "normal"
                    ? "Normal"
                    : textSize === "large"
                    ? "Large"
                    : "Extra Large"}
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">
                Notifications
              </h2>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">
                  Order notifications
                </Label>

                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Receive updates about your orders.
              </p>
            </div>

            {/* Account */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">
                Account
              </h2>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/account")}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;