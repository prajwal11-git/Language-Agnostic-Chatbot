import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  Home,
  DollarSign,
  MessageSquare,
  FileText,
  Calendar,
  Bell,
  Clock,
  CheckCircle2,
  BookOpen,
  Bot,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { title: "Home", path: "/student", icon: Home },
  { title: "Fees", path: "/student/fees", icon: DollarSign },
  { title: "Raise Feedback", path: "/student/feedback", icon: MessageSquare },
  { title: "Apply for Certificates", path: "/student/certificates", icon: FileText },
  { title: "Attendance", path: "/student/attendance", icon: CheckCircle2 },
  { title: "Notices", path: "/student/notices", icon: Bell },
  { title: "Timetable", path: "/student/timetable", icon: Clock },
  { title: "College Assistant", path: "/student/chatbot", icon: Bot },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  const userInfo = {
    name: "John Doe",
    role: "Student",
    class: "Computer Science - Semester 6",
    department: "Department of Computer Science",
    rollNumber: "CS2021-042",
  };

  const todayClasses = [
    { time: "09:00 AM", subject: "Data Structures", room: "Lab 301", status: "completed" },
    { time: "11:00 AM", subject: "Computer Networks", room: "Room 205", status: "ongoing" },
    { time: "02:00 PM", subject: "Machine Learning", room: "Room 402", status: "upcoming" },
    { time: "04:00 PM", subject: "Web Development", room: "Lab 101", status: "upcoming" },
  ];

  const notices = [
    { title: "Mid-term Exam Schedule Released", date: "Today", urgent: true },
    { title: "Library Timings Extended", date: "Yesterday", urgent: false },
    { title: "Workshop on AI & ML - Register Now", date: "2 days ago", urgent: false },
  ];

  const attendanceBySubject = [
    { subject: "Data Structures", percentage: 92 },
    { subject: "Computer Networks", percentage: 88 },
    { subject: "Machine Learning", percentage: 85 },
    { subject: "Web Development", percentage: 90 },
    { subject: "Operating Systems", percentage: 78 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Student Dashboard" userInfo={userInfo} />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">
                Welcome back, {userInfo.name.split(" ")[0]}!
              </h2>
              <p className="text-muted-foreground">
                Here's what's happening with your academics today
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
              <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                    <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">87%</h3>
                <p className="text-sm text-muted-foreground">Overall Attendance</p>
                <Progress value={87} className="mt-3" />
              </div>

              <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">4</h3>
                <p className="text-sm text-muted-foreground">Classes Today</p>
                <p className="text-xs text-secondary mt-2">1 ongoing, 2 upcoming</p>
              </div>

              <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Bell className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">3</h3>
                <p className="text-sm text-muted-foreground">New Notices</p>
                <p className="text-xs text-accent mt-2">1 urgent</p>
              </div>

              <div 
                className="bg-gradient-primary border border-border rounded-xl p-6 shadow-sm hover:shadow-glow transition-all cursor-pointer"
                onClick={() => navigate("/student/chatbot")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-primary-foreground mb-1">
                  College Assistant
                </h3>
                <p className="text-sm text-primary-foreground/80">Ask me anything →</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Breakdown */}
              <div className="lg:col-span-2 bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Attendance by Subject
                  </h3>
                  <button 
                    onClick={() => navigate("/student/attendance")}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details →
                  </button>
                </div>
                <div className="space-y-4">
                  {attendanceBySubject.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{item.subject}</span>
                        <span className={`text-sm font-semibold ${
                          item.percentage >= 85 ? 'text-green-500' : 
                          item.percentage >= 75 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {item.percentage}%
                        </span>
                      </div>
                      <Progress 
                        value={item.percentage} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Classes */}
              <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Today's Schedule
                  </h3>
                  <button 
                    onClick={() => navigate("/student/timetable")}
                    className="text-sm text-primary hover:underline"
                  >
                    Full Timetable →
                  </button>
                </div>
                <div className="space-y-3">
                  {todayClasses.map((cls, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        cls.status === 'completed' ? 'bg-muted/50 border-border opacity-60' :
                        cls.status === 'ongoing' ? 'bg-secondary/10 border-secondary' :
                        'bg-background border-border'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-foreground">{cls.subject}</span>
                        <Badge variant={
                          cls.status === 'completed' ? 'secondary' :
                          cls.status === 'ongoing' ? 'default' : 'outline'
                        } className="text-xs">
                          {cls.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {cls.time}
                        <span>•</span>
                        {cls.room}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notice Board */}
            <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Notices
                </h3>
                <button 
                  onClick={() => navigate("/student/notices")}
                  className="text-sm text-primary hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {notices.map((notice, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-all cursor-pointer"
                  >
                    {notice.urgent && (
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{notice.title}</h4>
                      <p className="text-sm text-muted-foreground">{notice.date}</p>
                    </div>
                    {notice.urgent && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;