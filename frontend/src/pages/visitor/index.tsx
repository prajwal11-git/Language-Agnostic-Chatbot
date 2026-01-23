import { useState } from "react";
import { Bot, X, GraduationCap, BookOpen, Users, Award, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const VisitorLanding = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (content: string) => {
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "Welcome to our campus! I can help you with information about admissions, courses, facilities, and more. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Excellence College</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Courses
              </a>
              <a href="#admissions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Admissions
              </a>
              <a href="#campus" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Campus Life
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <Button
                onClick={() => setShowChat(true)}
                size="sm"
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                <Bot className="w-4 h-4 mr-2" />
                Chat Assistant
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-6xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Excellence in Education
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering minds, shaping futures. Join a community of learners and innovators at one of the nation's leading institutions.
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all">
                Apply Now
              </Button>
              <Button size="lg" variant="outline">
                Virtual Tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "50+", label: "Years of Excellence" },
              { value: "10,000+", label: "Students Enrolled" },
              { value: "500+", label: "Expert Faculty" },
              { value: "95%", label: "Placement Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2 animate-fade-in">
                <h3 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground">
              About Our Institution
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded with a vision to nurture talent and foster innovation, our institution has been at the forefront of quality education for over five decades. We combine traditional values with modern teaching methodologies to create a holistic learning environment.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our state-of-the-art infrastructure, world-class faculty, and industry partnerships ensure that our students are well-prepared for the challenges of tomorrow.
            </p>
            <Button variant="outline" className="mt-4">
              Learn More About Us
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm space-y-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Accredited Programs</h3>
              <p className="text-sm text-muted-foreground">Nationally recognized degrees</p>
            </div>
            <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm space-y-2 mt-8">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Modern Library</h3>
              <p className="text-sm text-muted-foreground">Digital & physical resources</p>
            </div>
            <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm space-y-2">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Expert Faculty</h3>
              <p className="text-sm text-muted-foreground">Industry professionals</p>
            </div>
            <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm space-y-2 mt-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Career Support</h3>
              <p className="text-sm text-muted-foreground">100% placement assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">Courses Offered</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of programs designed to prepare you for success in your chosen field
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Computer Science & Engineering", programs: "B.Tech, M.Tech, Ph.D", seats: "120" },
              { name: "Electronics & Communication", programs: "B.Tech, M.Tech", seats: "90" },
              { name: "Mechanical Engineering", programs: "B.Tech, M.Tech", seats: "90" },
              { name: "Business Administration", programs: "BBA, MBA", seats: "60" },
              { name: "Data Science & AI", programs: "B.Tech, M.Tech", seats: "60" },
              { name: "Civil Engineering", programs: "B.Tech, M.Tech", seats: "60" },
            ].map((course, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {course.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{course.programs}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{course.seats} seats available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life Section */}
      <section id="campus" className="py-20 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">Campus Life</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience a vibrant community with diverse clubs, sports, cultural events, and endless opportunities for growth
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Student Clubs", desc: "50+ active clubs covering tech, arts, sports, and social causes" },
              { title: "Sports Facilities", desc: "Olympic-size pool, indoor stadium, cricket grounds, and more" },
              { title: "Cultural Events", desc: "Annual fest, tech symposiums, cultural nights, and competitions" },
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-gradient-card border border-border rounded-xl p-8 shadow-sm text-center space-y-3"
              >
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold text-foreground">Recent Achievements</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                "Ranked Top 10 Engineering College by National Survey 2024",
                "100% Placement Record for Computer Science Department",
                "Best Innovation Lab Award in Regional Competition",
              ].map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-foreground">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-card border border-border rounded-2xl p-12 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-muted-foreground">Have questions? We're here to help!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Visit Us</h3>
              <p className="text-sm text-muted-foreground">123 University Road, Education City, State 123456</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <Phone className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Call Us</h3>
              <p className="text-sm text-muted-foreground">+91 1234567890<br />Mon-Sat, 9AM-6PM</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                <Mail className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Email Us</h3>
              <p className="text-sm text-muted-foreground">admissions@college.edu<br />info@college.edu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-8 border-t border-sidebar-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Campus Intelligence. All rights reserved.</p>
        </div>
      </footer>

      {/* Chatbot Widget */}
      {showChat ? (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col animate-scale-in overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary-foreground" />
              <span className="font-semibold text-primary-foreground">
                Campus Assistant
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(false)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Bot className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">
                  How can I help you?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ask me about admissions, courses, or campus facilities
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatBubble key={index} {...message} />
              ))
            )}
          </div>

          <div className="border-t border-border">
            <ChatInput
              onSend={handleSend}
              placeholder="Ask about our campus..."
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setShowChat(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-primary shadow-2xl hover:shadow-glow transition-all animate-scale-in z-50"
        >
          <Bot className="w-8 h-8" />
        </Button>
      )}
    </div>
  );
};

export default VisitorLanding;