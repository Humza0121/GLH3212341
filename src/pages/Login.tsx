import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, setToken } from "@/lib/api";
import { setSessionUser } from "@/lib/session";

/* ---------------- TYPES ---------------- */

interface StoredUser {
  id: string;
  email: string;
  phone?: string;
  role?: string;
  loyaltyPoints?: number;
  name?: string;
}

/* ---------------- COMPONENT ---------------- */

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  /* -------- VALIDATION -------- */

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------- SUBMIT -------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await apiFetch<{
        token: string;
        user: StoredUser;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      setToken(result.token);
      setSessionUser(result.user);

      toast({
        title: "Welcome back!",
        description: result.user.name
          ? `Logged in as ${result.user.name}`
          : `Logged in as ${result.user.email}`,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  /* -------- UI -------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center">
            <User className="w-8 h-8 text-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">
          Log in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Actions */}
          <Button type="submit" className="w-full">
            Log in
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              toast({
                title: "Coming soon",
                description: "Password reset will be available later",
              })
            }
          >
            Forgot password
          </Button>

          <Button type="button" variant="secondary" className="w-full" asChild>
            <Link to="/signup">
              Don't have an account? Create one
            </Link>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;