import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { Bot, BarChart3, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const FacultyDashboard = () => {
  const navigate = useNavigate();

  const userInfo = {
    name: "Dr. Sarah Williams",
    role: "Faculty",
    department: "Department of Computer Science",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Faculty Dashboard" userInfo={userInfo} />
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome, {userInfo.name}
            </h2>
            <p className="text-muted-foreground">
              Manage your classes and track student performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <Card
              title="Faculty Assistant"
              icon={Bot}
              onClick={() => navigate("/faculty/chatbot")}
            >
              <p className="text-sm">
                Get AI-powered insights and assistance for your teaching workflow
              </p>
            </Card>

            <Card 
              title="Analytics Dashboard" 
              icon={BarChart3}
              onClick={() => navigate("/faculty/analytics")}
            >
              <p className="text-sm">
                View student performance, engagement metrics, and insights
              </p>
            </Card>

            <Card title="Operational Insights" icon={Users}>
              <p className="text-sm">View class statistics and performance metrics</p>
            </Card>

            <Card title="Sentiment & Feedback" icon={MessageSquare}>
              <p className="text-sm">Review student feedback and course evaluations</p>
            </Card>
          </div>

          <div className="pt-6">
            <Button
              onClick={() => navigate("/faculty/chatbot")}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              <Bot className="w-5 h-5 mr-2" />
              Open Faculty Assistant
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
