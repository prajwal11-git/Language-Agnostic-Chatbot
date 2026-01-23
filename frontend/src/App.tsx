import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Login
import LoginPage from "./pages/login";

// Student Pages
import StudentDashboard from "./pages/student";
import FeesPage from "./pages/student/fees";
import FeedbackPage from "./pages/student/feedback";
import CertificatesPage from "./pages/student/certificates";
import AttendancePage from "./pages/student/attendance";
import NoticesPage from "./pages/student/notices";
import TimetablePage from "./pages/student/timetable";
import StudentChatbot from "./pages/student/chatbot";

// Faculty Pages
import FacultyDashboard from "./pages/faculty";
import FacultyChatbot from "./pages/faculty/chatbot";
import FacultyAnalytics from "./pages/faculty/analytics";

// Admin Pages
import AdminDashboard from "./pages/admin";
import AdminChatbot from "./pages/admin/chatbot";
import AdminAnalytics from "./pages/admin/analytics";

// Visitor
import VisitorLanding from "./pages/visitor";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/fees" element={<FeesPage />} />
          <Route path="/student/feedback" element={<FeedbackPage />} />
          <Route path="/student/certificates" element={<CertificatesPage />} />
          <Route path="/student/attendance" element={<AttendancePage />} />
          <Route path="/student/notices" element={<NoticesPage />} />
          <Route path="/student/timetable" element={<TimetablePage />} />
          <Route path="/student/chatbot" element={<StudentChatbot />} />
          
          {/* Faculty Routes */}
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/faculty/chatbot" element={<FacultyChatbot />} />
          <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/chatbot" element={<AdminChatbot />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          
          {/* Visitor */}
          <Route path="/visitor" element={<VisitorLanding />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
