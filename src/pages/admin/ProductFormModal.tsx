import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { Category, Product, ProductImage } from "@/lib/types";

interface Props {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = {
  category_id: "",
  nome: "",
  descricao: "",
  preco: "",
  preco_promocional: "",
  sku: "",
  quantidade_estoque: "",
  estoque_minimo: "5",
  peso: "",
  dimensoes: "",
  status: "ativo" as "ativo" | "inativo",
};

export function ProductFormModal({ product, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [existingImage, setExistingImage] = useState<ProductImage | null>(null);

  useEffect(() => {
    if (product) {
      setForm({
        category_id: String(product.category_id),
        nome: product.nome,
        descricao: product.descricao ?? "",
        preco: String(product.preco),
        preco_promocional: product.preco_promocional != null ? String(product.preco_promocional) : "",
        sku: product.sku,
        quantidade_estoque: String(product.quantidade_estoque),
        estoque_minimo: String(product.estoque_minimo),
        peso: product.peso != null ? String(product.peso) : "",
        dimensoes: product.dimensoes ?? "",
        status: product.status,
      });
      api.post("/product-image/list", { product_id: product.id, principal: true }).then((res) => {
        const img = res.data.data.data[0] ?? null;
        setExistingImage(img);
        setImageUrl(img?.url ?? "");
      });
    } else {
      setForm(emptyForm);
      setExistingImage(null);
      setImageUrl("");
    }
  }, [product]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const preco = Number(form.preco);
    const precoPromo = form.preco_promocional ? Number(form.preco_promocional) : null;
    if (precoPromo != null && precoPromo >= preco) {
      setError("O preço promocional precisa ser menor que o preço normal.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        category_id: Number(form.category_id),
        nome: form.nome,
        descricao: form.descricao || undefined,
        preco,
        preco_promocional: precoPromo,
        sku: form.sku,
        quantidade_estoque: Number(form.quantidade_estoque),
        estoque_minimo: Number(form.estoque_minimo),
        peso: form.peso ? Number(form.peso) : undefined,
        dimensoes: form.dimensoes || undefined,
        status: form.status,
      };

      let productId = product?.id;
      if (product) {
        await api.put("/product/update", { product_id: product.id, ...payload });
      } else {
        const { data } = await api.post("/product/create", payload);
        productId = data.data.id;
      }

      if (imageUrl && productId) {
        if (existingImage) {
          await api.put("/product-image/update", { product_image_id: existingImage.id, url: imageUrl, principal: true });
        } else {
          await api.post("/product-image/create", { product_id: productId, url: imageUrl, principal: true });
        }
      }

      onSaved();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F2A3F]">{product ? "Editar Produto" : "Novo Produto"}</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-[#0F2A3F]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Nome</label>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Categoria</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            >
              <option value="" disabled>Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">SKU</label>
            <input
              required
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Preço (R$)</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Preço Promocional (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.preco_promocional}
              onChange={(e) => setForm({ ...form, preco_promocional: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Estoque</label>
            <input
              required
              type="number"
              min="0"
              value={form.quantidade_estoque}
              onChange={(e) => setForm({ ...form, quantidade_estoque: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Estoque Mínimo</label>
            <input
              required
              type="number"
              min="0"
              value={form.estoque_minimo}
              onChange={(e) => setForm({ ...form, estoque_minimo: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Peso (kg)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.peso}
              onChange={(e) => setForm({ ...form, peso: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Dimensões</label>
            <input
              value={form.dimensoes}
              onChange={(e) => setForm({ ...form, dimensoes: e.target.value })}
              placeholder="ex.: 10x5x2 cm"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "ativo" | "inativo" })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-[#0F2A3F]">Imagem Principal (URL)</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
            />
          </div>

          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
