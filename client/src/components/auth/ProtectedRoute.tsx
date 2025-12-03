import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [setLocation]);

  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
