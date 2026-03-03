import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { addStudent as apiAddStudent } from "../services/api";

export default function AddStudent() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    id: "",
    name: "",
    className: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      setError("Not connected. Please try again.");
      return;
    }
    const { id, name, className, contact } = form;
    if (!id.trim() || !name.trim() || !className.trim()) {
      setError("Student ID, Full Name, and Class are required.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await apiAddStudent(
        actor,
        id.trim(),
        name.trim(),
        className.trim(),
        contact.trim(),
      );
      setSuccess(true);
      setForm({ id: "", name: "", className: "", contact: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Manage Students
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground">
          Add Student
        </h2>
        <p className="text-muted-foreground">
          Register a new student in the system.
        </p>
      </div>

      <Card className="shadow-card border-border max-w-xl">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="font-display text-lg font-bold">
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="student-id" className="font-medium">
                Student ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="student-id"
                placeholder="e.g. S001"
                value={form.id}
                onChange={(e) => updateField("id", e.target.value)}
                disabled={loading}
                className="h-10"
                data-ocid="add_student.id_input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="student-name" className="font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="student-name"
                placeholder="e.g. Jane Doe"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={loading}
                className="h-10"
                data-ocid="add_student.name_input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="student-class" className="font-medium">
                Class / Grade <span className="text-destructive">*</span>
              </Label>
              <Input
                id="student-class"
                placeholder="e.g. Grade 10A"
                value={form.className}
                onChange={(e) => updateField("className", e.target.value)}
                disabled={loading}
                className="h-10"
                data-ocid="add_student.class_input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="student-contact" className="font-medium">
                Contact Info
              </Label>
              <Input
                id="student-contact"
                placeholder="e.g. parent@email.com or +1-555-0100"
                value={form.contact}
                onChange={(e) => updateField("contact", e.target.value)}
                disabled={loading}
                className="h-10"
                data-ocid="add_student.contact_input"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  data-ocid="add_student.error_state"
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
                  data-ocid="add_student.success_state"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  Student added successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 font-semibold"
              data-ocid="add_student.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Student...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
