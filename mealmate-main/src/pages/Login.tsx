import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Utensils } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (email && password) {
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", email.split("@")[0]);
      toast.success("Welcome to MealMate!");
      
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } else {
      toast.error("Please fill in all fields");
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
            <div className="space-y-2">
              <Label htmlFor="role">Login as</Label>
              <Select value={role} onValueChange={(value: "student" | "admin") => setRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin / Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-eco-gradient hover:opacity-90 transition-opacity">
              Login
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
