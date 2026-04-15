import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter, ShoppingBag, ShoppingCart, UserCircle, Accessibility } from "lucide-react";

interface SidebarProps {
  onLogout?: () => void;
  isLoggedIn: boolean;
  onFilterToggle?: () => void;
  onAccessToggle?: () => void;
}

const Sidebar = ({ onLogout, isLoggedIn, onFilterToggle, onAccessToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-28 shrink-0 bg-card border-r border-border p-3 flex flex-col gap-2 hidden md:flex" role="navigation" aria-label="Sidebar navigation">
      <Button
        variant={location.pathname === "/" ? "default" : "outline"}
        size="sm"
        className="justify-start text-xs"
        onClick={onFilterToggle}
      >
        <Filter className="w-3 h-3 mr-1" /> Filter
      </Button>
      <Button
        variant={location.pathname === "/basket" ? "default" : "outline"}
        size="sm"
        className="justify-start text-xs"
        onClick={() => navigate("/basket")}
      >
        <ShoppingCart className="w-3 h-3 mr-1" /> Basket
      </Button>
      <Button
        variant={location.pathname === "/orders" ? "default" : "outline"}
        size="sm"
        className="justify-start text-xs"
        onClick={() => navigate("/orders")}
      >
        <ShoppingBag className="w-3 h-3 mr-1" /> Orders
      </Button>
      <Button
        variant={location.pathname === "/account" ? "default" : "outline"}
        size="sm"
        className="justify-start text-xs"
        onClick={() => navigate("/account")}
      >
        <UserCircle className="w-3 h-3 mr-1" /> Account
      </Button>
      <Button
        variant={location.pathname === "/accessibility" ? "default" : "outline"}
        size="sm"
        className="justify-start text-xs"
        onClick={() => navigate("/accessibility")}
      >
        <Accessibility className="w-3 h-3 mr-1" /> Access
      </Button>

      <div className="mt-auto">
        {isLoggedIn && onLogout && (
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={onLogout}>
            Log out
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
