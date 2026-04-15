import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

type TextSize = "normal" | "large" | "x-large";

const getInitialDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("glh_dark_mode") === "true";
};

const getInitialTextSize = (): TextSize => {
  if (typeof window === "undefined") return "normal";

  const value = localStorage.getItem("glh_text_size");
  if (value === "normal" || value === "large" || value === "x-large") {
    return value;
  }
  return "normal";
};

const Accessibility = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [textSize, setTextSize] = useState<TextSize>(getInitialTextSize);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("glh_current_user");
    setIsLoggedIn(!!user);
  }, []);

  // Apply dark mode safely
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("glh_dark_mode", String(darkMode));
  }, [darkMode]);

  // Apply text size safely
  useEffect(() => {
    if (typeof document === "undefined") return;

    const sizes: Record<TextSize, string> = {
      normal: "16px",
      large: "20px",
      "x-large": "24px",
    };

    document.documentElement.style.fontSize = sizes[textSize];
    localStorage.setItem("glh_text_size", textSize);
  }, [textSize]);

  const handleLogout = () => {
    localStorage.removeItem("glh_current_user");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Prevent flicker
  if (isLoggedIn === null) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar isLoggedIn={!!isLoggedIn} onLogout={handleLogout} />

        <main className="flex-1 p-4 md:p-6" role="main">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">
            Accessibility Settings
          </h1>

          <div className="max-w-lg space-y-6">
            {/* Dark Mode */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                  <Label
                    htmlFor="access-dark"
                    className="text-sm font-semibold cursor-pointer"
                  >
                    Dark Mode
                  </Label>
                </div>

                <Switch
                  id="access-dark"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  aria-label="Toggle dark mode"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Switch between light and dark colour schemes.
              </p>
            </div>

            {/* Text Size */}
            <div className="bg-card rounded-lg border border-border p-6">
              <Label className="text-sm font-semibold mb-3 block">
                Text Size
              </Label>

              <div
                className="flex gap-2"
                role="radiogroup"
                aria-label="Text size"
              >
                {(["normal", "large", "x-large"] as const).map((size) => (
                  <Button
                    key={size}
                    role="radio"
                    aria-checked={textSize === size}
                    variant={textSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTextSize(size)}
                  >
                    A
                    <span className="sr-only">
                      {size === "normal"
                        ? "Normal"
                        : size === "large"
                        ? "Large"
                        : "Extra large"}{" "}
                      text
                    </span>
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
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Accessibility;