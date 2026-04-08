
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/services/authService";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index page: Checking authentication status...");
    
    // If user is authenticated, redirect to dashboard
    // Otherwise, redirect to login
    if (isAuthenticated()) {
      console.log("User authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    } else {
      console.log("User not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Mengarahkan...</p>
      </div>
    </div>
  );
}
