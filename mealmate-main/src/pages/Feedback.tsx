import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Leaf, LogOut, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Feedback = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [suggestions, setSuggestions] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    toast.success("Thank you for your feedback! +5 EcoPoints earned", {
      description: "Your input helps us improve"
    });
    navigate("/home");
  };

  const toggleReason = (reason: string) => {
    setReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const reasonOptions = [
    "Too Spicy",
    "Too Cold",
    "Not Fresh",
    "Didn't Like Taste",
    "Portion Too Large",
    "Portion Too Small",
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
            <span className="text-sm font-medium hidden sm:inline">Welcome, {userName}</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/home")}>
              Back to Home
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-card-hover">
          <CardHeader>
            <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
            <CardDescription>
              Help us improve our meal service and reduce food waste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-3">
                <Label className="text-base">How was today's meal?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? "fill-warning text-warning"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {rating === 5 && "Excellent! 🌟"}
                    {rating === 4 && "Very Good! 😊"}
                    {rating === 3 && "Good 👍"}
                    {rating === 2 && "Could be better 😐"}
                    {rating === 1 && "Needs improvement 😞"}
                  </p>
                )}
              </div>

              {/* Reasons */}
              <div className="space-y-3">
                <Label className="text-base">Select reasons (if any)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {reasonOptions.map((reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <Checkbox
                        id={reason}
                        checked={reasons.includes(reason)}
                        onCheckedChange={() => toggleReason(reason)}
                      />
                      <label
                        htmlFor={reason}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <Label htmlFor="suggestions" className="text-base">
                  Your suggestions
                </Label>
                <Textarea
                  id="suggestions"
                  placeholder="Share your thoughts on how we can improve..."
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Your feedback helps us create better menus and reduce waste
                </p>
              </div>

              <Button type="submit" className="w-full bg-eco-gradient hover:opacity-90">
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="py-4 text-center">
            <p className="text-sm font-medium">
              💚 Earn +5 EcoPoints for every feedback submission!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Feedback;
