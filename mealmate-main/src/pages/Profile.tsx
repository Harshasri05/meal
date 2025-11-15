import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Leaf, LogOut, Award, TrendingUp, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = {
    mealsTaken: 15,
    mealsSaved: 6,
    kgSaved: 12,
    ecoPoints: 84,
  };

  const history = [
    { date: "2025-01-13", meal: "Breakfast - Idli", portion: "Medium", confirmed: true },
    { date: "2025-01-13", meal: "Lunch - Rice & Dal", portion: "Small", confirmed: true },
    { date: "2025-01-12", meal: "Dinner - Chapati", portion: "Medium", confirmed: true },
    { date: "2025-01-12", meal: "Lunch - Biryani", portion: "Large", confirmed: true },
    { date: "2025-01-12", meal: "Breakfast - Dosa", portion: "Small", confirmed: true },
  ];

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
            <Button variant="outline" size="sm" onClick={() => navigate("/home")}>
              Back to Home
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Info */}
        <Card className="shadow-card-hover">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{userName}</CardTitle>
                <CardDescription className="text-base mt-2">
                  Computer Science • Year 2
                </CardDescription>
              </div>
              <div className="flex flex-col items-center gap-2 bg-eco-gradient p-4 rounded-lg text-white">
                <Award className="h-8 w-8" />
                <span className="text-2xl font-bold">{stats.ecoPoints}</span>
                <span className="text-xs">EcoPoints</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Meals Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.mealsTaken}</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Meals Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">{stats.mealsSaved}</p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Food Waste Avoided
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{stats.kgSaved} kg</p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card className="shadow-card-hover">
          <CardHeader>
            <CardTitle>Meal History</CardTitle>
            <CardDescription>Your recent meal confirmations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Meal</TableHead>
                  <TableHead>Portion</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.meal}</TableCell>
                    <TableCell>
                      <Badge variant={item.portion === "Small" ? "default" : "secondary"}>
                        {item.portion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-success text-success">
                        Confirmed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Feedback CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Share Your Feedback</p>
                <p className="text-sm text-muted-foreground">Help us improve our meal service</p>
              </div>
            </div>
            <Button onClick={() => navigate("/feedback")} className="bg-eco-gradient hover:opacity-90">
              Give Feedback
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
