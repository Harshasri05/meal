import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Leaf, LogOut, Coffee, Sun, Moon, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = [
  { type: "breakfast", icon: Coffee, label: "Breakfast" },
  { type: "lunch", icon: Sun, label: "Lunch" },
  { type: "dinner", icon: Moon, label: "Dinner" },
];

// Mock menu data
const WEEKLY_MENU = {
  Monday: { breakfast: "Idli & Sambar", lunch: "Rice & Dal", dinner: "Chapati & Curry" },
  Tuesday: { breakfast: "Dosa & Chutney", lunch: "Biryani", dinner: "Paratha & Paneer" },
  Wednesday: { breakfast: "Poha", lunch: "Rice & Sambar", dinner: "Chapati & Dal" },
  Thursday: { breakfast: "Upma", lunch: "Pulao", dinner: "Roti & Sabzi" },
  Friday: { breakfast: "Vada & Sambar", lunch: "Fried Rice", dinner: "Chapati & Curry" },
  Saturday: { breakfast: "Idli & Chutney", lunch: "Rice & Rasam", dinner: "Paratha & Dal" },
  Sunday: { breakfast: "Puri & Bhaji", lunch: "Special Meal", dinner: "Chapati & Paneer" },
};

const Home = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  
  const [confirmations, setConfirmations] = useState<Record<string, boolean>>({});
  const [portions, setPortions] = useState<Record<string, string>>({});

  const handleConfirmation = (day: string, mealType: string, confirmed: boolean) => {
    const key = `${day}-${mealType}`;
    setConfirmations({ ...confirmations, [key]: confirmed });
    if (confirmed && !portions[key]) {
      setPortions({ ...portions, [key]: "medium" });
    }
  };

  const handleSaveWeekPlan = () => {
    const confirmedCount = Object.values(confirmations).filter(Boolean).length;
    toast.success(`Week plan saved! +${confirmedCount} EcoPoints earned 🌱`, {
      description: "Thank you for helping reduce food waste!"
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const todayConfirmed = {
    breakfast: 345,
    lunch: 563,
    dinner: 456
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Leaf className="h-6 w-6" />
              <span className="font-bold text-xl bg-eco-gradient bg-clip-text text-transparent">
                MealMate
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline">Welcome, {userName}</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
              Profile
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Timer Alert */}
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="py-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning" />
            <div className="flex-1">
              <p className="font-medium text-sm">Confirmation closes in 3h 12m</p>
              <p className="text-xs text-muted-foreground">Save your plan before deadline!</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Menu Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Weekly Menu</h2>
            <Button onClick={handleSaveWeekPlan} className="bg-eco-gradient hover:opacity-90">
              Save Your Week Plan
            </Button>
          </div>

          <div className="grid gap-4">
            {DAYS.map((day) => (
              <Card key={day} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {MEAL_TYPES.map(({ type, icon: Icon, label }) => {
                      const key = `${day}-${type}`;
                      const isConfirmed = confirmations[key];
                      const menuItem = WEEKLY_MENU[day as keyof typeof WEEKLY_MENU][type as keyof typeof WEEKLY_MENU.Monday];

                      return (
                        <div key={type} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{menuItem}</p>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={isConfirmed === true ? "default" : "outline"}
                              className={isConfirmed === true ? "bg-success hover:bg-success/90" : ""}
                              onClick={() => handleConfirmation(day, type, true)}
                            >
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              variant={isConfirmed === false ? "destructive" : "outline"}
                              onClick={() => handleConfirmation(day, type, false)}
                            >
                              No
                            </Button>
                          </div>

                          {isConfirmed === true && (
                            <Select
                              value={portions[key] || "medium"}
                              onValueChange={(value) => setPortions({ ...portions, [key]: value })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small 🌱 +2 pts</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Today's Summary */}
        <Card className="shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Today's Summary
            </CardTitle>
            <CardDescription>Real-time confirmation counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Coffee className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Breakfast</p>
                <p className="text-xs text-muted-foreground mb-2">Idli & Sambar</p>
                <Badge variant="secondary" className="text-lg font-bold">
                  {todayConfirmed.breakfast}
                </Badge>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Sun className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Lunch</p>
                <p className="text-xs text-muted-foreground mb-2">Rice & Dal</p>
                <Badge variant="secondary" className="text-lg font-bold">
                  {todayConfirmed.lunch}
                </Badge>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Moon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Dinner</p>
                <p className="text-xs text-muted-foreground mb-2">Chapati & Curry</p>
                <Badge variant="secondary" className="text-lg font-bold">
                  {todayConfirmed.dinner}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Home;
