import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

export function useLogout() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const resetCart = useCartStore((s) => s.reset);

  return async function logout() {
    await signOut();
    resetCart();
    navigate("/login", { replace: true });
  };
}
