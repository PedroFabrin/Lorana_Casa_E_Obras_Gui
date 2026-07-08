import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, FolderCog, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { AtivoStatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/format";
import { ProductFormModal } from "@/pages/admin/ProductFormModal";
import { CategoriasModal } from "@/pages/admin/CategoriasModal";
import type { Category, Product, Section } from "@/lib/types";

export function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [showCategorias, setShowCategorias] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadProducts() {
    setLoading(true);
    api
      .post("/product/list", { page_size: 100 })
      .then((res) => setProducts(res.data.data.data))
      .finally(() => setLoading(false));
  }

  function loadTaxonomy() {
    api.post("/category/list", { page_size: 100 }).then((res) => setCategories(res.data.data.data));
    api.post("/section/list", { page_size: 50 }).then((res) => setSections(res.data.data.data));
  }

  useEffect(() => {
    loadProducts();
    loadTaxonomy();
  }, []);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const sectionById = useMemo(() => new Map(sections.map((s) => [s.id, s])), [sections]);

  const visibleProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const category = categoryById.get(p.category_id);
    const matchesSection = !sectionFilter || category?.section_id === Number(sectionFilter);
    return matchesSearch && matchesSection;
  });

  async function handleDelete(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    await api.delete(`/product/delete/${id}`);
    loadProducts();
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#0F2A3F]">Gerenciamento de Produtos</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowCategorias(true)}>
            <FolderCog size={16} /> Categorias
          </Button>
          <Button onClick={() => setEditing(null)}>
            <Plus size={16} /> Novo Produto
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou SKU..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
        />
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
        >
          <option value="">Todas as Seções</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-150 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-150 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3 hidden md:table-cell">SKU</th>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3 hidden md:table-cell">Seção</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Carregando...</td></tr>
            ) : visibleProducts.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Nenhum produto encontrado.</td></tr>
            ) : (
              visibleProducts.map((p) => {
                const category = categoryById.get(p.category_id);
                const section = category ? sectionById.get(category.section_id) : undefined;
                const lowStock = p.quantidade_estoque < p.estoque_minimo;
                return (
                  <tr key={p.id} className="border-b border-gray-150">
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.sku}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0F2A3F]">{p.nome}</div>
                      <div className="text-xs text-gray-400">{category?.nome ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{section?.nome ?? "—"}</td>
                    <td className="px-4 py-3 text-[#0F2A3F]">{formatPrice(p.preco)}</td>
                    <td className="px-4 py-3">
                      <span className={lowStock ? "flex items-center gap-1 font-medium text-red-600" : "text-[#0F2A3F]"}>
                        {lowStock && <AlertTriangle size={14} />}
                        {p.quantidade_estoque}
                      </span>
                    </td>
                    <td className="px-4 py-3"><AtivoStatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditing(p)}
                        aria-label={`Editar ${p.nome}`}
                        className="mr-1 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-[#B97A4F]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        aria-label={`Excluir ${p.nome}`}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editing !== undefined && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            loadProducts();
          }}
        />
      )}

      {showCategorias && (
        <CategoriasModal onClose={() => setShowCategorias(false)} onChanged={loadTaxonomy} />
      )}
    </div>
  );
}
