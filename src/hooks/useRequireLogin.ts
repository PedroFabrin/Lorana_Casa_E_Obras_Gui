import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export function useRequireLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((s) => s.token);

  return function requireLogin(): boolean {
    if (token) return true;
    navigate("/login", { state: { from: location } });
    return false;
  };
}
