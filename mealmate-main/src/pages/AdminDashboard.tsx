import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Leaf, LogOut, TrendingDown, Users, Scale, Brain, Star, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [wasteWeight, setWasteWeight] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleLogWaste = () => {
    if (wasteWeight) {
      toast.success("Waste logged successfully");
      setWasteWeight("");
    }
  };

  const todayConfirmed = {
    breakfast: { count: 345, portion: { small: 120, medium: 180, large: 45 } },
    lunch: { count: 563, portion: { small: 180, medium: 300, large: 83 } },
    dinner: { count: 456, portion: { small: 150, medium: 250, large: 56 } },
  };

  const aiSuggestions = [
    { ingredient: "Rice", amount: "50 kg", status: "Reduce by 5kg vs yesterday" },
    { ingredient: "Dal", amount: "15 kg", status: "Same as usual" },
    { ingredient: "Oil", amount: "8 L", status: "Increase by 1L" },
    { ingredient: "Vegetables", amount: "25 kg", status: "Reduce by 3kg" },
  ];

  const feedbackData = [
    { user: "Student 1", rating: 5, comment: "Excellent meal today!", meal: "Lunch" },
    { user: "Student 2", rating: 4, comment: "Good but a bit spicy", meal: "Dinner" },
    { user: "Student 3", rating: 3, comment: "Cold food", meal: "Breakfast" },
    { user: "Student 4", rating: 5, comment: "Perfect!", meal: "Lunch" },
  ];

  const wasteProneItems = [
    { item: "Chapati", wasteRate: "22%", avgLeftover: "5.2 kg", trend: "up" },
    { item: "Rice (Friday)", wasteRate: "18%", avgLeftover: "8.1 kg", trend: "up" },
    { item: "Curry (Thursday)", wasteRate: "15%", avgLeftover: "3.5 kg", trend: "stable" },
  ];

  const topStudents = [
    { name: "Rahul Kumar", ecoPoints: 156, mealsSaved: 12 },
    { name: "Priya Singh", ecoPoints: 142, mealsSaved: 11 },
    { name: "Amit Patel", ecoPoints: 138, mealsSaved: 10 },
    { name: "Sneha Reddy", ecoPoints: 125, mealsSaved: 9 },
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
                MealMate Admin
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">1,364</p>
              <p className="text-xs text-muted-foreground mt-1">Active users</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Waste Reduced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">18%</p>
              <p className="text-xs text-muted-foreground mt-1">vs last week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Today's Waste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">12.5 kg</p>
              <p className="text-xs text-muted-foreground mt-1">Logged so far</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4" />
                Avg Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-warning">4.2</p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today">Today's Counts</TabsTrigger>
            <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
            <TabsTrigger value="waste">Waste Analytics</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Today's Counts */}
          <TabsContent value="today" className="space-y-4">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle>Today's Meal Confirmations</CardTitle>
                <CardDescription>Real-time student confirmations by meal and portion size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(todayConfirmed).map(([meal, data]) => (
                    <div key={meal} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold capitalize">{meal}</h3>
                        <Badge variant="secondary" className="text-lg font-bold">
                          {data.count} students
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-success/10 p-3 rounded-lg text-center">
                          <p className="text-muted-foreground mb-1">Small</p>
                          <p className="text-xl font-bold text-success">{data.portion.small}</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg text-center">
                          <p className="text-muted-foreground mb-1">Medium</p>
                          <p className="text-xl font-bold text-primary">{data.portion.medium}</p>
                        </div>
                        <div className="bg-secondary/10 p-3 rounded-lg text-center">
                          <p className="text-muted-foreground mb-1">Large</p>
                          <p className="text-xl font-bold text-secondary">{data.portion.large}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Log Waste */}
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle>Log Waste Weight</CardTitle>
                <CardDescription>Record waste from smart bins or manual weighing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="waste">Waste weight (kg)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="waste"
                      type="number"
                      placeholder="0.0"
                      value={wasteWeight}
                      onChange={(e) => setWasteWeight(e.target.value)}
                    />
                    <Button onClick={handleLogWaste} className="bg-eco-gradient hover:opacity-90">
                      Log Waste
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Suggestions */}
          <TabsContent value="ai" className="space-y-4">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI-Powered Raw Material Suggestions
                </CardTitle>
                <CardDescription>Optimized quantities for tomorrow based on confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient</TableHead>
                      <TableHead>Recommended Amount</TableHead>
                      <TableHead>Suggestion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiSuggestions.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.ingredient}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-base">
                            {item.amount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Waste Analytics */}
          <TabsContent value="waste" className="space-y-4">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Waste-Prone Items
                </CardTitle>
                <CardDescription>Dishes with highest waste rates - consider alternatives</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Waste Rate</TableHead>
                      <TableHead>Avg Leftover</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wasteProneItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{item.wasteRate}</Badge>
                        </TableCell>
                        <TableCell>{item.avgLeftover}</TableCell>
                        <TableCell>
                          <Badge variant={item.trend === "up" ? "destructive" : "secondary"}>
                            {item.trend}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback */}
          <TabsContent value="feedback" className="space-y-4">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle>Recent Student Feedback</CardTitle>
                <CardDescription>Latest ratings and comments from students</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Meal</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbackData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.user}</TableCell>
                        <TableCell>{item.meal}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{item.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students */}
          <TabsContent value="students" className="space-y-4">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle>Top EcoWarriors</CardTitle>
                <CardDescription>Students leading in waste reduction</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>EcoPoints</TableHead>
                      <TableHead>Meals Saved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-eco-gradient text-white">
                            {student.ecoPoints}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.mealsSaved}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
