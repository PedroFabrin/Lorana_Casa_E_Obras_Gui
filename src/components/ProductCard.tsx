import { Link } from "react-router-dom";
import { ShoppingCart, ImageOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useProductImage } from "@/hooks/useProductImage";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useCartStore } from "@/store/cart";
import { useCartToastStore } from "@/store/cartToast";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = useProductImage(product.id);
  const { addItem } = useCartStore();
  const requireLogin = useRequireLogin();
  const showToast = useCartToastStore((s) => s.show);
  const [adding, setAdding] = useState(false);

  const hasPromo =
    product.preco_promocional != null && product.preco_promocional < product.preco;
  const currentPrice = hasPromo ? product.preco_promocional! : product.preco;
  const outOfStock = product.quantidade_estoque <= 0 || product.status === "inativo";

  async function handleAdd() {
    if (!requireLogin()) return;
    setAdding(true);
    try {
      await addItem(product.id, 1);
      showToast(product.nome, 1);
    } finally {
      setAdding(false);
    }
  }

  const lowStock = !outOfStock && product.quantidade_estoque <= product.estoque_minimo;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-150 bg-white transition-shadow hover:shadow-md">
      <Link to={`/produtos/${product.id}`} className="block aspect-square bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={product.nome} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff size={32} />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs uppercase tracking-wide text-[#4A5568]">SKU: {product.sku}</span>
        <Link to={`/produtos/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold text-[#0A2540] hover:text-[#C36A2E]">
            {product.nome}
          </h3>
        </Link>
        <div className="mt-1">
          {hasPromo && (
            <span className="mr-2 text-sm text-gray-400 line-through">{formatPrice(product.preco)}</span>
          )}
          <span className="text-lg font-bold text-[#0A2540]">{formatPrice(currentPrice)}</span>
        </div>
        <span className={lowStock ? "text-xs font-medium text-[#C36A2E]" : "text-xs text-gray-400"}>
          {outOfStock ? "Sem estoque" : `${product.quantidade_estoque} em estoque`}
        </span>
        <Button
          className="mt-3"
          fullWidth
          disabled={outOfStock || adding}
          onClick={handleAdd}
        >
          <ShoppingCart size={16} />
          {outOfStock ? "Indisponível" : "Adicionar ao Carrinho"}
        </Button>
      </div>
    </div>
  );
}
