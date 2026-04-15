import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Sun, Moon } from "lucide-react";

interface AccessPanelProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  textSize: "normal" | "large" | "x-large";
  onTextSizeChange: (size: "normal" | "large" | "x-large") => void;
}

const AccessPanel = ({ open, onClose, darkMode, onDarkModeChange, textSize, onTextSizeChange }: AccessPanelProps) => {
  if (!open) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-bold text-foreground">Accessibility Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close accessibility settings">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between py-3 border-b border-border">
        <div className="flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
          <Label htmlFor="dark-mode" className="text-sm font-semibold text-foreground cursor-pointer">
            Dark Mode
          </Label>
        </div>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={onDarkModeChange}
        />
      </div>

      {/* Text Size */}
      <div className="py-3">
        <Label className="text-sm font-semibold text-foreground mb-2 block">Text Size</Label>
        <div className="flex gap-2">
          <Button
            variant={textSize === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => onTextSizeChange("normal")}
            className="text-xs"
          >
            A <span className="sr-only">Normal text</span>
          </Button>
          <Button
            variant={textSize === "large" ? "default" : "outline"}
            size="sm"
            onClick={() => onTextSizeChange("large")}
            className="text-sm"
          >
            A <span className="sr-only">Large text</span>
          </Button>
          <Button
            variant={textSize === "x-large" ? "default" : "outline"}
            size="sm"
            onClick={() => onTextSizeChange("x-large")}
            className="text-base"
          >
            A <span className="sr-only">Extra large text</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Current: {textSize === "normal" ? "Normal" : textSize === "large" ? "Large" : "Extra Large"}
        </p>
      </div>
    </div>
  );
};

export default AccessPanel;
