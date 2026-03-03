import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenLine,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import AddMarks from "../components/AddMarks";
import AddStudent from "../components/AddStudent";
import Analytics from "../components/Analytics";
import Dashboard from "../components/Dashboard";
import ReportCard from "../components/ReportCard";
import { useActor } from "../hooks/useActor";
import { listStudents } from "../services/api";

type Tab =
  | "dashboard"
  | "add_student"
  | "add_marks"
  | "report_card"
  | "analytics";

interface AdminPageProps {
  username: string;
  onLogout: () => void;
}

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "add_student", label: "Add Student", icon: UserPlus },
  { id: "add_marks", label: "Record Marks", icon: PenLine },
  { id: "report_card", label: "Report Card", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminPage({ username, onLogout }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [reportStudentId, setReportStudentId] = useState("");
  const { actor, isFetching } = useActor();

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => listStudents(actor!),
    enabled: !!actor && !isFetching && activeTab === "report_card",
  });

  return (
    <div className="min-h-screen flex flex-col" data-ocid="admin.page">
      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-sidebar-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display text-base font-semibold text-sidebar-foreground">
            AcademIQ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-sidebar-foreground/60 bg-sidebar-accent px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 bg-sidebar flex-col border-r border-sidebar-border min-h-screen sticky top-0 h-screen">
          {/* Logo */}
          <div className="px-5 py-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <span className="font-display text-lg font-semibold text-sidebar-foreground">
                AcademIQ
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs text-sidebar-foreground/50 uppercase tracking-wider">
                Administrator
              </p>
              <p className="text-sm font-semibold text-sidebar-foreground mt-0.5">
                {username}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive
                      ? "sidebar-nav-item-active"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                  data-ocid={`admin.${item.id}_tab`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-4 border-t border-sidebar-border pt-4">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-label="Sign out icon"
                role="img"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden w-full">
          <div className="flex overflow-x-auto bg-sidebar px-2 py-2 gap-1 border-b border-sidebar-border">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                  }`}
                  data-ocid={`admin.${item.id}_tab`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-screen">
          {activeTab === "dashboard" && <Dashboard username={username} />}
          {activeTab === "add_student" && <AddStudent />}
          {activeTab === "add_marks" && <AddMarks />}
          {activeTab === "report_card" && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
                  Academic Record
                </p>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Report Card
                </h2>
                <p className="text-muted-foreground">
                  Select a student to view their report card.
                </p>
              </div>
              <div className="max-w-sm flex flex-col gap-2">
                <Label className="font-medium">Select Student</Label>
                <Select
                  value={reportStudentId}
                  onValueChange={setReportStudentId}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((s) => (
                      <SelectItem key={s.studentId} value={s.studentId}>
                        {s.name} ({s.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {reportStudentId && <ReportCard studentId={reportStudentId} />}
            </section>
          )}
          {activeTab === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
}
