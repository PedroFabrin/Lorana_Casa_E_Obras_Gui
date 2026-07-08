import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImageOff, Minus, Plus, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { useProductImage } from "@/hooks/useProductImage";
import { useCartStore } from "@/store/cart";
import { useCartToastStore } from "@/store/cartToast";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { addItem } = useCartStore();
  const showToast = useCartToastStore((s) => s.show);

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [adding, setAdding] = useState(false);
  const imageUrl = useProductImage(Number(id));

  useEffect(() => {
    setQuantidade(1);
    api.get(`/product/${id}`).then((res) => setProduct(res.data.data));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    api.get(`/category/${product.category_id}`).then((res) => setCategory(res.data.data));
    api
      .post("/product/list", { category_id: product.category_id, status: "ativo", page_size: 5 })
      .then((res) => setRelated(res.data.data.data.filter((p: Product) => p.id !== product.id).slice(0, 4)));
  }, [product]);

  if (!product) {
    return <div className="mx-auto max-w-7xl px-6 py-10 text-[#45505A]">Carregando produto...</div>;
  }

  const hasPromo = product.preco_promocional != null && product.preco_promocional < product.preco;
  const currentPrice = hasPromo ? product.preco_promocional! : product.preco;
  const outOfStock = product.quantidade_estoque <= 0 || product.status === "inativo";
  const lowStock = !outOfStock && product.quantidade_estoque <= product.estoque_minimo;

  async function handleAdd(goToCart: boolean) {
    if (!token) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addItem(product!.id, quantidade);
      if (goToCart) {
        navigate("/carrinho");
      } else {
        showToast(product!.nome, quantidade);
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link to="/produtos" className="mb-6 flex items-center gap-1 text-sm text-[#1F3A5F] hover:text-[#0B1B2B]">
        <ArrowLeft size={16} /> Voltar
      </Link>

      <div className="grid gap-10 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt={product.nome} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <ImageOff size={48} />
            </div>
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide text-[#4A5568]">SKU: {product.sku}</span>
          <h1 className="mt-1 text-2xl font-bold text-[#0B1B2B]">{product.nome}</h1>
          {category && (
            <p className="mt-1 text-sm text-[#1F3A5F]">
              Categoria:{" "}
              <Link to={`/produtos?category_id=${category.id}`} className="text-[#C36A2E] hover:underline">
                {category.nome}
              </Link>
            </p>
          )}

          <div className="mt-4">
            {hasPromo && (
              <span className="mr-2 text-base text-gray-400 line-through">{formatPrice(product.preco)}</span>
            )}
            <span className="text-3xl font-bold text-[#0B1B2B]">{formatPrice(currentPrice)}</span>
          </div>
          <p className="mt-1 text-sm text-[#1F3A5F]">ou até 10x de {formatPrice(currentPrice / 10)} sem juros</p>

          <div className="mt-4">
            {outOfStock ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Sem estoque</span>
            ) : lowStock ? (
              <span className="rounded-full bg-[#A88F6A] px-3 py-1 text-xs font-semibold text-white">
                Estoque baixo: {product.quantidade_estoque} unidades
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                {product.quantidade_estoque} unidades disponíveis
              </span>
            )}
          </div>

          {!outOfStock && (
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm font-medium text-[#0B1B2B]">Quantidade:</span>
              <div className="flex items-center rounded-md border border-gray-300">
                <button
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                  className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-[#C36A2E] hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm">{quantidade}</span>
                <button
                  onClick={() => setQuantidade((q) => Math.min(product.quantidade_estoque, q + 1))}
                  aria-label="Aumentar quantidade"
                  className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-[#C36A2E] hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button fullWidth disabled={outOfStock || adding} onClick={() => handleAdd(true)}>
              Comprar Agora
            </Button>
            <Button variant="outline" fullWidth disabled={outOfStock || adding} onClick={() => handleAdd(false)}>
              <ShoppingCart size={16} /> Adicionar ao Carrinho
            </Button>
          </div>

          {product.descricao && (
            <div className="mt-8 border-t border-gray-150 pt-6">
              <h2 className="mb-2 font-semibold text-[#0B1B2B]">Descrição</h2>
              <p className="text-sm text-[#1F3A5F]">{product.descricao}</p>
            </div>
          )}

          <div className="mt-6 border-t border-gray-150 pt-6">
            <h2 className="mb-2 font-semibold text-[#0B1B2B]">Especificações Técnicas</h2>
            <ul className="space-y-1 text-sm text-[#1F3A5F]">
              <li><span className="text-[#A88F6A]">•</span> SKU: {product.sku}</li>
              {product.peso != null && <li><span className="text-[#A88F6A]">•</span> Peso: {product.peso} kg</li>}
              {product.dimensoes && <li><span className="text-[#A88F6A]">•</span> Dimensões: {product.dimensoes}</li>}
              <li><span className="text-[#A88F6A]">•</span> Estoque mínimo: {product.estoque_minimo} unidades</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 text-xl font-bold text-[#0B1B2B]">Produtos Relacionados</h2>
          <div className="flex flex-wrap gap-5">
            {related.map((p) => (
              <div key={p.id} className="w-[calc(50%-10px)] sm:w-[calc(25%-15px)]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
