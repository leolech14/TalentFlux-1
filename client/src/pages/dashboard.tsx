import { useAuth } from "../hooks/useAuth";
import { CandidateDashboard } from "../features/candidate/CandidateDashboard";
import { EmployerDashboard } from "../features/employer/EmployerDashboard";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {user.userType === "candidate" ? (
        <CandidateDashboard user={user} />
      ) : (
        <EmployerDashboard user={user} />
      )}
    </div>
  );
}
