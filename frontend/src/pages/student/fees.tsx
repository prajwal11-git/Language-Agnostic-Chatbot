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
  Download,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const FeesPage = () => {
  const userInfo = {
    name: "John Doe",
    role: "Student",
    class: "Computer Science - Semester 6",
    department: "Department of Computer Science",
    rollNumber: "CS2021-042",
  };

  const feeStructure = [
    { item: "Tuition Fee", amount: 45000, status: "paid" },
    { item: "Lab Fee", amount: 8000, status: "paid" },
    { item: "Library Fee", amount: 2000, status: "paid" },
    { item: "Development Fee", amount: 5000, status: "pending" },
    { item: "Exam Fee", amount: 3000, status: "pending" },
  ];

  const paymentHistory = [
    { date: "2024-01-15", description: "Semester 6 - Tuition Fee", amount: 45000, receipt: "RCP001234" },
    { date: "2024-01-15", description: "Semester 6 - Lab Fee", amount: 8000, receipt: "RCP001235" },
    { date: "2023-07-10", description: "Semester 5 - Full Payment", amount: 63000, receipt: "RCP000987" },
  ];

  const totalFees = feeStructure.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = feeStructure.filter(f => f.status === "paid").reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = totalFees - paidAmount;

  return (
    <div className="min-h-screen bg-background">
      <Header title="Fee Management" userInfo={userInfo} />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-2 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">Fee Management</h2>
              <p className="text-muted-foreground">View and manage your fee payments</p>
            </div>

            {/* Fee Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
              <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Total Fees</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">₹{totalFees.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Current Semester</p>
              </div>

              <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">Paid Amount</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">{Math.round((paidAmount/totalFees)*100)}% Complete</p>
              </div>

              <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-destructive flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-destructive-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Pending</h3>
                </div>
                <p className="text-3xl font-bold text-destructive">₹{pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Due by Mar 15, 2024</p>
              </div>
            </div>

            {/* Fee Structure */}
            <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-6">Current Semester Fee Structure</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Fee Item</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Amount</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeStructure.map((fee, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="py-4 px-4 text-foreground">{fee.item}</td>
                        <td className="py-4 px-4 text-right text-foreground font-medium">
                          ₹{fee.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Badge variant={fee.status === "paid" ? "default" : "destructive"}>
                            {fee.status === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/50 font-semibold">
                      <td className="py-4 px-4 text-foreground">Total</td>
                      <td className="py-4 px-4 text-right text-foreground">
                        ₹{totalFees.toLocaleString()}
                      </td>
                      <td className="py-4 px-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {pendingAmount > 0 && (
                <div className="mt-6 flex justify-end">
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now (₹{pendingAmount.toLocaleString()})
                  </Button>
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-6">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Receipt</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-foreground">{payment.description}</td>
                        <td className="py-4 px-4 text-right text-foreground font-medium">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">{payment.receipt}</td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeesPage;
