import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, setToken } from "@/lib/api";
import { setSessionUser } from "@/lib/session";

/* ---------------- TYPES ---------------- */

type Role = "customer" | "producer";

interface ApiUser {
  id: string;
  email: string;
  phone?: string | null;
  role: Role;
  loyaltyPoints: number;
  name: string;
}

/* ---------------- COMPONENT ---------------- */

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [role, setRole] = useState<Role>("customer");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  /* -------- VALIDATION -------- */

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email format";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 6) {
      e.password = "Must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (form.phone && !/^[\d\s+()-]{7,15}$/.test(form.phone)) {
      e.phone = "Invalid phone number";
    }

    if (!termsAccepted) {
      e.terms = "You must accept the terms and conditions";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* -------- SUBMIT -------- */

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      const result = await apiFetch<{
        token: string;
        user: ApiUser;
      }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          phone: form.phone || undefined,
          role,
        }),
      });

      setToken(result.token);
      setSessionUser(result.user);

      toast({
        title: "Account created!",
        description:
          role === "customer"
            ? "Registered as Customer"
            : "Registered as Farmer / Producer",
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Sign up failed",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  /* -------- UPDATE FORM -------- */

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  /* -------- UI -------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md bg-card border rounded-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Sign up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div>
            <Label>I am signing up as:</Label>

            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as Role)}
              className="flex gap-4 mt-2"
            >
              <RadioGroupItem value="customer" id="c" />
              <Label htmlFor="c">Customer</Label>

              <RadioGroupItem value="producer" id="p" />
              <Label htmlFor="p">Producer</Label>
            </RadioGroup>
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={update("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={update("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm */}
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label>Phone (optional)</Label>
            <Input
              value={form.phone}
              onChange={update("phone")}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <Checkbox
              checked={termsAccepted}
              onCheckedChange={(v) =>
                setTermsAccepted(v === true)
              }
            />
            <Label>
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-primary underline"
              >
                Terms
              </Link>
            </Label>
          </div>

          {errors.terms && (
            <p className="text-sm text-destructive">
              {errors.terms}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Already have an account?</Link>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
