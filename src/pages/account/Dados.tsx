import { useState } from "react";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";

export function Dados() {
  const { user, refreshMe } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", cpf: user?.cpf ?? "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const payload: Record<string, string | number> = { user_id: user!.id, name: form.name, email: form.email, cpf: form.cpf };
      if (form.password) payload.password = form.password;
      await api.put("/users/update", payload);
      await refreshMe();
      setForm((f) => ({ ...f, password: "" }));
      setMessage("Dados atualizados com sucesso.");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-150 bg-white p-6">
      <h2 className="mb-5 text-lg font-bold text-[#0F2A3F]">Meus Dados</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#45505A]">Nome</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#45505A]">CPF</label>
          <input
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#45505A]">E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#45505A]">Nova Senha</label>
          <input
            type="password"
            placeholder="Deixe em branco para manter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
          />
        </div>
        {message && <p className="text-sm text-green-600 sm:col-span-2">{message}</p>}
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <Button type="submit" disabled={saving} className="sm:col-span-2 sm:w-fit">
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  );
}
