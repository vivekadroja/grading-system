import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2, PenLine } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import {
  addMark as apiAddMark,
  listStudents,
  listSubjects,
} from "../services/api";

const EXAM_TYPES = ["Midterm", "Final", "Assignment", "Quiz"] as const;

export default function AddMarks() {
  const { actor, isFetching } = useActor();
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [examType, setExamType] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: () => listStudents(actor!),
    enabled: !!actor && !isFetching,
  });

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => listSubjects(actor!),
    enabled: !!actor && !isFetching,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      setError("Not connected. Please try again.");
      return;
    }
    const numScore = Number(score);
    if (!studentId || !subjectId || !examType || score === "") {
      setError("All fields are required.");
      return;
    }
    if (Number.isNaN(numScore) || numScore < 0 || numScore > 100) {
      setError("Score must be a number between 0 and 100.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await apiAddMark(actor, studentId, subjectId, numScore, examType);
      setSuccess(true);
      setStudentId("");
      setSubjectId("");
      setExamType("");
      setScore("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to record mark. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDataLoading = loadingStudents || loadingSubjects;

  return (
    <section className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Assessment
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground">
          Record Marks
        </h2>
        <p className="text-muted-foreground">
          Enter a student's score for a subject and exam type.
        </p>
      </div>

      <Card className="shadow-card border-border max-w-xl">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
            <PenLine className="w-4 h-4 text-accent-foreground" />
          </div>
          <CardTitle className="font-display text-lg font-bold">
            Mark Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isDataLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Student */}
              <div className="flex flex-col gap-2">
                <Label className="font-medium">
                  Student <span className="text-destructive">*</span>
                </Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger
                    className="h-10"
                    data-ocid="add_marks.student_select"
                  >
                    <SelectValue placeholder="Select a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.length === 0 ? (
                      <SelectItem value="__none" disabled>
                        No students found
                      </SelectItem>
                    ) : (
                      students?.map((s) => (
                        <SelectItem key={s.studentId} value={s.studentId}>
                          {s.name}{" "}
                          <span className="text-muted-foreground ml-1 text-xs">
                            ({s.studentId})
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <Label className="font-medium">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Select value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger
                    className="h-10"
                    data-ocid="add_marks.subject_select"
                  >
                    <SelectValue placeholder="Select a subject..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.length === 0 ? (
                      <SelectItem value="__none" disabled>
                        No subjects found
                      </SelectItem>
                    ) : (
                      subjects?.map((s) => (
                        <SelectItem key={s.subjectId} value={s.subjectId}>
                          {s.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Type */}
              <div className="flex flex-col gap-2">
                <Label className="font-medium">
                  Exam Type <span className="text-destructive">*</span>
                </Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger
                    className="h-10"
                    data-ocid="add_marks.exam_type_select"
                  >
                    <SelectValue placeholder="Select exam type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Score */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="score" className="font-medium">
                  Score (0–100) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="score"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="e.g. 85"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  disabled={loading}
                  className="h-10"
                  data-ocid="add_marks.score_input"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                    data-ocid="add_marks.error_state"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-md bg-success/10 border border-success/30 text-success text-sm"
                    data-ocid="add_marks.success_state"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Mark recorded successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loading}
                className="h-10 font-semibold"
                data-ocid="add_marks.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <PenLine className="w-4 h-4 mr-2" />
                    Record Mark
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
