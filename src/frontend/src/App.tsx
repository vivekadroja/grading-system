import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { UserRole } from "./backend.d";
import Login from "./components/Login";
import AdminPage from "./pages/AdminPage";
import FacultyPage from "./pages/FacultyPage";
import StudentPage from "./pages/StudentPage";

interface AuthState {
  role: UserRole;
  username: string;
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(null);

  function handleLogin(role: UserRole, username: string) {
    setAuth({ role, username });
  }

  function handleLogout() {
    setAuth(null);
  }

  return (
    <>
      <Toaster richColors position="top-right" />

      {!auth && <Login onLogin={handleLogin} />}

      {auth?.role === UserRole.admin && (
        <AdminPage username={auth.username} onLogout={handleLogout} />
      )}

      {auth?.role === UserRole.faculty && (
        <FacultyPage username={auth.username} onLogout={handleLogout} />
      )}

      {auth?.role === UserRole.student && (
        <StudentPage
          studentId="S001"
          username={auth.username}
          onLogout={handleLogout}
        />
      )}

      {/* Floating logout button for any authenticated state */}
      {auth && (
        <button
          type="button"
          onClick={handleLogout}
          className="fixed top-4 right-4 z-50 hidden"
          data-ocid="app.logout_button"
          aria-label="Sign out"
        />
      )}
    </>
  );
}
