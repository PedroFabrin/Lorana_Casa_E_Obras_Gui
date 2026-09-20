import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { apiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      const from = (location.state as { from?: Location })?.from;
      navigate(from ? `${from.pathname}${from.search}` : "/", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "E-mail ou senha inválidos."));
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-[#0B1B2B]">Entrar na sua conta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#0B1B2B]">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#C36A2E]"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#0B1B2B]">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#C36A2E]"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500">
        Não tem conta?{" "}
        <Link to="/cadastro" className="font-medium text-[#C36A2E] hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
