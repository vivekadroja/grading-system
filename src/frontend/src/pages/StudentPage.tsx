import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, User } from "lucide-react";
import ReportCard from "../components/ReportCard";
import { useActor } from "../hooks/useActor";
import { listStudents } from "../services/api";

interface StudentPageProps {
  studentId: string;
  username: string;
  onLogout: () => void;
}

export default function StudentPage({
  studentId,
  username,
  onLogout,
}: StudentPageProps) {
  const { actor, isFetching } = useActor();

  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => listStudents(actor!),
    enabled: !!actor && !isFetching,
  });

  const student = students?.find((s) => s.studentId === studentId);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-ocid="student.page"
    >
      {/* Header */}
      <header className="border-b border-border bg-sidebar">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold text-sidebar-foreground">
              AcademIQ
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sidebar-foreground/70 text-sm">
              <User className="w-4 h-4" />
              <span>{username}</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs text-sidebar-foreground/50 hover:text-destructive transition-colors px-2 py-1 rounded-md hover:bg-sidebar-accent"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        <section data-ocid="student.report_card_section">
          {/* Student header card */}
          <div className="flex flex-col gap-1 mb-8">
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
              My Academics
            </p>
            <div className="flex items-end gap-3">
              <h1 className="font-display text-3xl font-bold text-foreground">
                {isLoading ? (
                  <Skeleton className="h-9 w-48 inline-block" />
                ) : (
                  (student?.name ?? username)
                )}
              </h1>
              {!isLoading && student && (
                <span className="text-muted-foreground text-sm mb-1">
                  {student.className}
                </span>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <p className="text-muted-foreground text-sm">
                Student ID:{" "}
                <span className="font-mono font-medium text-foreground">
                  {studentId}
                </span>
                {student?.contact && (
                  <>
                    {" · "}
                    <span>{student.contact}</span>
                  </>
                )}
              </p>
            )}
          </div>

          <ReportCard studentId={studentId} />
        </section>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
