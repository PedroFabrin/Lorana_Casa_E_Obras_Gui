import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/users/create", form);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível concluir o cadastro."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-[#0B1B2B]">Criar conta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#0B1B2B]">Nome completo</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#C36A2E]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#0B1B2B]">E-mail</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#C36A2E]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#0B1B2B]">CPF</label>
          <input
            required
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            placeholder="000.000.000-00"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#C36A2E]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#0B1B2B]">Senha</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#C36A2E]"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500">
        Já tem conta?{" "}
        <Link to="/login" className="font-medium text-[#C36A2E] hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
