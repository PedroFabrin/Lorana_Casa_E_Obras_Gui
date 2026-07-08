import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { AtivoStatusBadge } from "@/components/ui/StatusBadge";
import type { Category, Section } from "@/lib/types";

interface Props {
  onClose: () => void;
  onChanged: () => void;
}

export function CategoriasModal({ onClose, onChanged }: Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newSection, setNewSection] = useState("");
  const [newCategory, setNewCategory] = useState({ section_id: "", nome: "" });
  const [error, setError] = useState("");

  function load() {
    api.post("/section/list", { page_size: 50 }).then((res) => setSections(res.data.data.data));
    api.post("/category/list", { page_size: 100 }).then((res) => setCategories(res.data.data.data));
  }

  useEffect(load, []);

  async function handleCreateSection(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/section/create", { nome: newSection });
      setNewSection("");
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/category/create", { section_id: Number(newCategory.section_id), nome: newCategory.nome });
      setNewCategory({ section_id: "", nome: "" });
      load();
      onChanged();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      await api.delete(`/category/delete/${id}`);
      load();
      onChanged();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function handleDeleteSection(id: number) {
    try {
      await api.delete(`/section/delete/${id}`);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F2A3F]">Seções e Categorias</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-[#0F2A3F]">
            <X size={20} />
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-[#0F2A3F]">Seções</h3>
          <div className="mb-3 flex flex-col gap-2">
            {sections.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border border-gray-150 px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  {s.nome} <AtivoStatusBadge status={s.status} />
                </span>
                <button
                  onClick={() => handleDeleteSection(s.id)}
                  aria-label={`Excluir seção ${s.nome}`}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleCreateSection} className="flex gap-2">
            <input
              required
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="Nome da nova seção"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
            <Button type="submit">
              <Plus size={16} /> Adicionar
            </Button>
          </form>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#0F2A3F]">Categorias</h3>
          <div className="mb-3 flex flex-col gap-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-gray-150 px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  {c.nome}{" "}
                  <span className="text-gray-400">
                    ({sections.find((s) => s.id === c.section_id)?.nome ?? "—"})
                  </span>
                  <AtivoStatusBadge status={c.status} />
                </span>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  aria-label={`Excluir categoria ${c.nome}`}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <select
              required
              value={newCategory.section_id}
              onChange={(e) => setNewCategory({ ...newCategory, section_id: e.target.value })}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            >
              <option value="" disabled>Seção...</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            <input
              required
              value={newCategory.nome}
              onChange={(e) => setNewCategory({ ...newCategory, nome: e.target.value })}
              placeholder="Nome da nova categoria"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
            <Button type="submit">
              <Plus size={16} /> Adicionar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
