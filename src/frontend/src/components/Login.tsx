import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { loginUser } from "../services/api";

interface LoginProps {
  onLogin: (role: UserRole, username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { actor, isFetching } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_roleHint, setRoleHint] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    if (!actor) {
      setError("Still connecting to the network. Please wait a moment.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const role = await loginUser(actor, username.trim(), password);
      onLogin(role, username.trim());
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-sidebar flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.82 0.16 75) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.55 0.14 155) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-sidebar-foreground tracking-tight">
              AcademIQ
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold text-sidebar-foreground leading-tight mb-6">
            Academic
            <br />
            <span className="text-sidebar-primary">Excellence</span>
            <br />
            Tracked.
          </h1>
          <p className="text-sidebar-foreground/70 text-lg leading-relaxed max-w-sm">
            Manage students, record marks, and generate comprehensive reports —
            all in one place.
          </p>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          {[
            { label: "Total Students", value: "1,240+" },
            { label: "Subjects Tracked", value: "48" },
            { label: "Reports Generated", value: "3,600+" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
              <span className="text-sidebar-foreground/60 text-sm">
                {stat.label}
              </span>
              <span className="ml-auto text-sidebar-foreground font-semibold text-sm">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              AcademIQ
            </span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Sign in
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
                className="h-11"
                data-ocid="login.username_input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  className="h-11 pr-10"
                  data-ocid="login.password_input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-foreground font-medium">
                Role (optional hint)
              </Label>
              <Select onValueChange={setRoleHint}>
                <SelectTrigger className="h-11" data-ocid="login.role_select">
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Your actual access level is determined by the system.
              </p>
            </div>

            {isFetching && !error && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-3 h-3 animate-spin" />
                Connecting to network...
              </div>
            )}

            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                data-ocid="login.error_state"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                {error}
              </div>
            )}

            {loading && (
              <div
                className="flex items-center gap-2 text-muted-foreground text-sm"
                data-ocid="login.loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing you in...
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || isFetching}
              className="h-11 text-base font-semibold mt-1"
              data-ocid="login.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Built with caffeine.ai
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
