import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.warn(
      "404: Attempted route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <main className="text-center max-w-md" role="main">
        <h1 className="mb-4 text-5xl font-bold">404</h1>

        <p className="mb-2 text-xl text-muted-foreground">
          Page not found
        </p>

        <p className="mb-6 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Go home (SPA safe) */}
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>

          {/* Go back */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
