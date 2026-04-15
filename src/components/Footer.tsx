import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-6" role="contentinfo">
      <div className="text-center mb-4">
        <p className="font-display text-lg font-bold">Follow our social media to see constant updates:</p>
      </div>
      <nav className="flex justify-center items-center gap-4 text-sm font-body" aria-label="Social media links">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
        <span aria-hidden="true">|</span>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
        <span aria-hidden="true">|</span>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:underline">X</a>
        <span aria-hidden="true">|</span>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:underline">TikTok</a>
      </nav>
      <div className="flex justify-center items-center gap-2 text-xs mt-4 opacity-75">
        <p>&copy; 2026 Greenfield Local Hub. All rights reserved.</p>
        <span aria-hidden="true">|</span>
        <Link to="/terms" className="hover:underline">Terms and Conditions</Link>
      </div>
    </footer>
  );
};

export default Footer;
