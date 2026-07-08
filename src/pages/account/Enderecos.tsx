import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import type { Address } from "@/lib/types";

const emptyForm = { rua: "", numero: "", cep: "", cidade: "", uf: "" };

export function Enderecos() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function load() {
    if (!user) return;
    api.post("/adress/list", { user_id: user.id, page_size: 50 }).then((res) => setAddresses(res.data.data.data));
  }

  useEffect(load, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/adress/create", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    await api.delete(`/adress/delete/${id}`);
    load();
  }

  return (
    <div className="rounded-lg border border-gray-150 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0F2A3F]">Meus Endereços</h2>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus size={16} /> Novo Endereço
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 grid gap-3 rounded-md bg-gray-50 p-4 sm:grid-cols-2">
          <input
            placeholder="CEP"
            value={form.cep}
            onChange={(e) => setForm({ ...form, cep: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
            required
          />
          <input
            placeholder="Rua"
            value={form.rua}
            onChange={(e) => setForm({ ...form, rua: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
            required
          />
          <input
            placeholder="Número"
            value={form.numero}
            onChange={(e) => setForm({ ...form, numero: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
            required
          />
          <input
            placeholder="Cidade"
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
            required
          />
          <input
            placeholder="UF"
            maxLength={2}
            value={form.uf}
            onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase() })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
            required
          />
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <Button type="submit" className="sm:col-span-2 sm:w-fit">
            Salvar Endereço
          </Button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="flex items-center justify-between rounded-md border border-gray-150 p-4 text-sm">
            <span className="flex items-center gap-2 text-[#0F2A3F]">
              <MapPin size={16} className="text-[#B97A4F]" />
              {addr.rua}, {addr.numero} — {addr.cidade}/{addr.uf} — CEP {addr.cep}
            </span>
            <button
              onClick={() => handleDelete(addr.id)}
              aria-label={`Remover endereço ${addr.rua}, ${addr.numero}`}
              className="flex h-10 w-10 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {addresses.length === 0 && <p className="text-sm text-[#45505A]">Nenhum endereço cadastrado.</p>}
      </div>
    </div>
  );
}
