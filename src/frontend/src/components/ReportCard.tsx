import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import type { Mark, Subject } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { getStudentMarks, listSubjects } from "../services/api";

interface ReportCardProps {
  studentId: string;
}

function getLetterGrade(avg: number): string {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

function gradeClass(grade: string): string {
  switch (grade) {
    case "A":
      return "grade-a";
    case "B":
      return "grade-b";
    case "C":
      return "grade-c";
    case "D":
      return "grade-d";
    default:
      return "grade-f";
  }
}

interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  marks: Mark[];
  avg: number;
  grade: string;
}

function buildSummary(marks: Mark[], subjects: Subject[]): SubjectSummary[] {
  const subjectMap = new Map(subjects.map((s) => [s.subjectId, s.name]));
  const grouped = new Map<string, Mark[]>();

  for (const mark of marks) {
    const existing = grouped.get(mark.subjectId) ?? [];
    existing.push(mark);
    grouped.set(mark.subjectId, existing);
  }

  const summaries: SubjectSummary[] = [];
  grouped.forEach((subjectMarks, subjectId) => {
    const avg =
      subjectMarks.reduce((sum, m) => sum + m.score, 0) / subjectMarks.length;
    summaries.push({
      subjectId,
      subjectName: subjectMap.get(subjectId) ?? subjectId,
      marks: subjectMarks,
      avg: Math.round(avg * 10) / 10,
      grade: getLetterGrade(avg),
    });
  });

  return summaries.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
}

export default function ReportCard({ studentId }: ReportCardProps) {
  const { actor, isFetching } = useActor();

  const {
    data: marks,
    isLoading: loadingMarks,
    error: marksError,
  } = useQuery({
    queryKey: ["marks", studentId],
    queryFn: () => getStudentMarks(actor!, studentId),
    enabled: !!actor && !isFetching && !!studentId,
  });

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => listSubjects(actor!),
    enabled: !!actor && !isFetching,
  });

  const isLoading = loadingMarks || loadingSubjects;
  const summary = marks && subjects ? buildSummary(marks, subjects) : [];

  return (
    <section data-ocid="report_card.section" className="flex flex-col gap-4">
      <Card className="shadow-card border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-lg font-bold">
              Report Card
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Student ID: {studentId}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div
              className="flex items-center gap-2 text-muted-foreground text-sm py-4"
              data-ocid="report_card.loading_state"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading report...
            </div>
          )}

          {marksError && !isLoading && (
            <p className="text-destructive text-sm">
              Failed to load marks. Please try again.
            </p>
          )}

          {!isLoading && summary.length === 0 && !marksError && (
            <div
              className="flex flex-col items-center justify-center py-10 text-center gap-2"
              data-ocid="report_card.empty_state"
            >
              <FileText className="w-10 h-10 text-muted-foreground/40" />
              <p className="font-medium text-muted-foreground">
                No marks found
              </p>
              <p className="text-sm text-muted-foreground/70">
                No assessments have been recorded for this student yet.
              </p>
            </div>
          )}

          {!isLoading && summary.length > 0 && (
            <>
              {/* Summary header */}
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {marks?.length ?? 0}
                  </span>{" "}
                  total assessments across{" "}
                  <span className="font-semibold text-foreground">
                    {summary.length}
                  </span>{" "}
                  subject{summary.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table data-ocid="report_card.table">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="font-semibold">Subject</TableHead>
                      <TableHead className="font-semibold">
                        Assessments
                      </TableHead>
                      <TableHead className="font-semibold">Avg Score</TableHead>
                      <TableHead className="font-semibold">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.map((row, idx) => (
                      <TableRow
                        key={row.subjectId}
                        data-ocid={`report_card.row.${idx + 1}`}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {row.subjectName}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {row.marks.map((m, mi) => (
                              <Badge
                                key={`${m.examType}-${mi}`}
                                variant="outline"
                                className="text-xs"
                              >
                                {m.examType}: {m.score}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{row.avg}</span>
                          <span className="text-muted-foreground text-xs ml-1">
                            / 100
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${gradeClass(row.grade)}`}
                          >
                            {row.grade}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Grade legend */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { grade: "A", range: "≥ 90" },
                  { grade: "B", range: "≥ 80" },
                  { grade: "C", range: "≥ 70" },
                  { grade: "D", range: "≥ 60" },
                  { grade: "F", range: "< 60" },
                ].map(({ grade, range }) => (
                  <div key={grade} className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${gradeClass(grade)}`}
                    >
                      {grade}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {range}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
