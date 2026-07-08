import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import type { Category, Product } from "@/lib/types";

type SortOption = "relevancia" | "menor_preco" | "maior_preco" | "nome";

export function ProductList() {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("category_id");
  const search = params.get("q") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 9;

  useEffect(() => {
    api
      .post("/category/list", { status: "ativo", page_size: 50 })
      .then((res) => setCategories(res.data.data.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .post("/product/list", {
        status: "ativo",
        category_id: categoryId ? Number(categoryId) : undefined,
        nome: search || undefined,
        page,
        page_size: pageSize,
      })
      .then((res) => {
        setProducts(res.data.data.data);
        setTotal(res.data.data.total);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [categoryId, search, page]);

  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => {
      const price = p.preco_promocional != null && p.preco_promocional < p.preco ? p.preco_promocional : p.preco;
      return price <= maxPrice;
    });
    list = [...list];
    if (sort === "menor_preco") list.sort((a, b) => a.preco - b.preco);
    if (sort === "maior_preco") list.sort((a, b) => b.preco - a.preco);
    if (sort === "nome") list.sort((a, b) => a.nome.localeCompare(b.nome));
    return list;
  }, [products, sort, maxPrice]);

  function setCategoryFilter(id: number | null) {
    const next = new URLSearchParams(params);
    if (id == null) next.delete("category_id");
    else next.set("category_id", String(id));
    setParams(next);
    setPage(1);
  }

  function clearFilters() {
    setParams({});
    setMaxPrice(1000);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const filtersContent = (
    <>
      <div className="mb-5">
        <h3 className="mb-2 text-sm font-semibold text-[#0A2540]">Categorias</h3>
        <div className="flex flex-col gap-2 text-sm">
          <button
            onClick={() => setCategoryFilter(null)}
            className={!categoryId ? "text-left font-semibold text-[#C36A2E]" : "text-left text-[#4A5568] hover:text-[#C36A2E]"}
          >
            Todas as Categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={
                categoryId === String(cat.id)
                  ? "text-left font-semibold text-[#C36A2E]"
                  : "text-left text-[#4A5568] hover:text-[#C36A2E]"
              }
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="mb-2 text-sm font-semibold text-[#0A2540]">Faixa de Preço</h3>
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#C36A2E]"
        />
        <div className="flex justify-between text-xs text-[#4A5568]">
          <span>R$ 0</span>
          <span>R$ {maxPrice}</span>
        </div>
      </div>

      <Button variant="outline" fullWidth onClick={clearFilters}>
        <X size={14} /> Limpar Filtros
      </Button>
    </>
  );

  return (
    <div className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="text-3xl font-bold text-[#0A2540]">Produtos</h1>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#4A5568]">{total} produtos encontrados</p>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#C36A2E]"
            >
              <option value="relevancia">Ordenar por: Relevância</option>
              <option value="menor_preco">Menor Preço</option>
              <option value="maior_preco">Maior Preço</option>
              <option value="nome">Nome A-Z</option>
            </select>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 rounded-md bg-[#C36A2E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a85825] lg:hidden"
            >
              <Filter size={16} /> Filtrar
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden h-fit rounded-lg border border-gray-150 bg-white p-5 lg:sticky lg:top-24 lg:block">
            <h2 className="mb-4 font-semibold text-[#0A2540]">Filtros</h2>
            {filtersContent}
          </aside>

          <div className="lg:max-w-4xl">
            {loading ? (
              <p className="text-sm text-[#4A5568]">Carregando produtos...</p>
            ) : visibleProducts.length === 0 ? (
              <p className="text-sm text-[#4A5568]">Nenhum produto encontrado.</p>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={
                      p === page
                        ? "h-9 w-9 rounded-md bg-[#C36A2E] text-sm font-semibold text-white"
                        : "h-9 w-9 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-[#0A2540]">Filtros</h2>
              <button
                onClick={() => setShowFilters(false)}
                aria-label="Fechar filtros"
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#0A2540]"
              >
                <X size={20} />
              </button>
            </div>
            {filtersContent}
            <Button fullWidth className="mt-4" onClick={() => setShowFilters(false)}>
              Ver Resultados
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
