import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Mark, Student, Subject, backendInterface } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { getStudentMarks, listStudents, listSubjects } from "../services/api";

interface SubjectAnalytics {
  subject: Subject;
  avg: number;
  passRate: number;
  totalMarks: number;
}

interface AnalyticsData {
  students: Student[];
  subjects: Subject[];
  analytics: SubjectAnalytics[];
}

async function fetchAllAnalytics(
  actor: backendInterface,
): Promise<AnalyticsData> {
  const [students, subjects] = await Promise.all([
    listStudents(actor),
    listSubjects(actor),
  ]);

  if (students.length === 0 || subjects.length === 0) {
    return { students, subjects, analytics: [] };
  }

  const allMarksResults = await Promise.all(
    students.map((s) =>
      getStudentMarks(actor, s.studentId).catch(() => [] as Mark[]),
    ),
  );
  const allMarks = allMarksResults.flat();

  const analytics: SubjectAnalytics[] = subjects.map((subject) => {
    const subjectMarks = allMarks.filter(
      (m) => m.subjectId === subject.subjectId,
    );
    const avg =
      subjectMarks.length > 0
        ? subjectMarks.reduce((sum, m) => sum + m.score, 0) /
          subjectMarks.length
        : 0;
    const passRate =
      subjectMarks.length > 0
        ? (subjectMarks.filter((m) => m.score >= 50).length /
            subjectMarks.length) *
          100
        : 0;
    return {
      subject,
      avg: Math.round(avg * 10) / 10,
      passRate: Math.round(passRate),
      totalMarks: subjectMarks.length,
    };
  });

  return { students, subjects, analytics };
}

function ScoreBar({ value }: { value: number }) {
  const pct = Math.min(100, value);
  const color =
    pct >= 80
      ? "bg-success"
      : pct >= 60
        ? "bg-chart-1"
        : pct >= 40
          ? "bg-warning"
          : "bg-destructive";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-sm font-semibold text-foreground w-10 text-right">
        {value}
      </span>
    </div>
  );
}

export default function Analytics() {
  const { actor, isFetching } = useActor();

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetchAllAnalytics(actor!),
    enabled: !!actor && !isFetching,
  });

  return (
    <section
      className="flex flex-col gap-6 animate-fade-in"
      data-ocid="analytics.section"
    >
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Insights
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground">
          Analytics
        </h2>
        <p className="text-muted-foreground">
          Performance overview across all students and subjects.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="shadow-card border-border"
          data-ocid="analytics.total_students_card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="font-display text-3xl font-bold">
                {data?.students.length ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subjects Tracked
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="font-display text-3xl font-bold">
                {data?.subjects.length ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Pass Rate
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="font-display text-3xl font-bold">
                {data?.analytics.length
                  ? `${Math.round(data.analytics.reduce((s, a) => s + a.passRate, 0) / data.analytics.length)}%`
                  : "—"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-subject breakdown */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg font-bold">
            Subject Performance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Average scores and pass rates per subject
          </p>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <p className="text-destructive text-sm">
              Failed to load analytics.
            </p>
          )}

          {!isLoading && data?.analytics.length === 0 && (
            <div className="flex flex-col items-center py-10 gap-2 text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground/40" />
              <p className="font-medium text-muted-foreground">
                No data available
              </p>
              <p className="text-sm text-muted-foreground/70">
                Add students and record marks to see analytics.
              </p>
            </div>
          )}

          {!isLoading && data && data.analytics.length > 0 && (
            <div className="flex flex-col divide-y divide-border">
              {data.analytics.map((row, idx) => (
                <div
                  key={row.subject.subjectId}
                  className="py-4 first:pt-0 last:pb-0"
                  data-ocid={`analytics.subject_row.${idx + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {row.subject.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {row.totalMarks} mark{row.totalMarks !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${
                        row.passRate >= 70
                          ? "text-success border-success/30"
                          : row.passRate >= 50
                            ? "text-warning border-warning/30"
                            : "text-destructive border-destructive/30"
                      }`}
                    >
                      {row.passRate}% pass rate
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Avg Score</span>
                      <span>100</span>
                    </div>
                    <ScoreBar value={row.avg} />
                  </div>

                  {row.totalMarks === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      No marks recorded yet.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
