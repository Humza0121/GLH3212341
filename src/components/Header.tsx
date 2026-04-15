import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";
import farmLogo from "@/assets/farm-logo.png";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-primary px-4 py-3 flex items-center justify-between" role="banner">
      <div className="flex items-center gap-3">
        <Link to="/" className="font-display text-lg font-bold text-primary-foreground leading-tight">
          Greenfield<br />Local Hub
        </Link>
        <img src={farmLogo} alt="Farming Company Logo" className="h-10 w-10 object-contain" />
        <span className="text-primary-foreground font-body text-sm hidden sm:inline">
          Welcome to Greenfield Local Hub
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <div className="w-9 h-9 rounded-full border-2 border-primary-foreground flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80" onClick={() => navigate("/settings")}>
              <Settings className="w-4 h-4 mr-1" /> Settings
            </Button>
          </>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>
            Log in
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
