import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Utensils } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, profile, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && profile && !loading) {
      if (profile.role === 'admin' || profile.role === 'canteen_staff') {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [user, profile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Welcome to MealMate!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card-hover border-border/50">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center gap-2 text-primary">
            <Leaf className="h-10 w-10" />
            <Utensils className="h-10 w-10 text-secondary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-eco-gradient bg-clip-text text-transparent">
            Welcome to MealMate
          </CardTitle>
          <CardDescription className="text-base">
            Reduce food waste, earn EcoPoints, make a difference
          </CardDescription>
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            ⏰ Confirm your meals before 12 AM. Confirmation closes 3h 12m before each meal.
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-eco-gradient hover:opacity-90 transition-opacity"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>
            <Button type="button" variant="link" className="w-full text-sm text-muted-foreground">
              Forgot password?
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
