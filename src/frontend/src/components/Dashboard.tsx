import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { useActor } from "../hooks/useActor";
import { getTotalStudents, listSubjects } from "../services/api";

interface DashboardProps {
  username: string;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export default function Dashboard({ username }: DashboardProps) {
  const { actor, isFetching } = useActor();

  const { data: totalStudents, isLoading: loadingStudents } = useQuery({
    queryKey: ["totalStudents"],
    queryFn: () => getTotalStudents(actor!),
    enabled: !!actor && !isFetching,
  });

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => listSubjects(actor!),
    enabled: !!actor && !isFetching,
  });

  const statsCards = [
    {
      title: "Total Students",
      value: loadingStudents ? null : String(totalStudents ?? 0),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      ocid: "dashboard.students_card",
    },
    {
      title: "Total Subjects",
      value: loadingSubjects ? null : String(subjects?.length ?? 0),
      icon: BookOpen,
      color: "text-accent-foreground",
      bg: "bg-accent/20",
      ocid: "dashboard.subjects_card",
    },
    {
      title: "Active Assessments",
      value: "4",
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
      ocid: "dashboard.assessments_card",
    },
    {
      title: "Grading Periods",
      value: "2",
      icon: Award,
      color: "text-chart-5",
      bg: "bg-chart-5/10",
      ocid: "dashboard.periods_card",
    },
  ];

  return (
    <section
      className="flex flex-col gap-8 animate-fade-in"
      data-ocid="dashboard.section"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Welcome back
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground">
          {username}
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's an overview of the grading system.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            data-ocid={card.ocid}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200 border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div
                  className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {card.value === null ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="font-display text-3xl font-bold text-foreground">
                    {card.value}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick info */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg font-bold">
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            The AcademIQ Grading System allows administrators to manage students
            and subjects, faculty to record marks across multiple assessment
            types, and students to view their academic progress.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              {
                role: "Admin",
                desc: "Full access: manage students, subjects, marks, and view analytics.",
              },
              {
                role: "Faculty",
                desc: "Record marks, view reports, and monitor class performance.",
              },
              {
                role: "Student",
                desc: "View personal report card with grades across all subjects.",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="p-4 rounded-lg bg-muted/50 border border-border"
              >
                <p className="font-semibold text-foreground mb-1">{r.role}</p>
                <p className="text-xs">{r.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
