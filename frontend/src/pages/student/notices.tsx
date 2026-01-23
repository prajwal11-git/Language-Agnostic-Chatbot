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
  Bot,
} from "lucide-react";

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

const NoticesPage = () => {
  const userInfo = {
    name: "John Doe",
    role: "Student",
    class: "Computer Science - Semester 6",
    department: "Department of Computer Science",
    rollNumber: "CS2021-042",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Notices" userInfo={userInfo} />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">Notice Board</h2>
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <p className="text-muted-foreground">Recent announcements and notices will be displayed here.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NoticesPage;
