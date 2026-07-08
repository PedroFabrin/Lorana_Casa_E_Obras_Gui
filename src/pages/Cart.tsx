import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImageOff, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useProductImage } from "@/hooks/useProductImage";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types";

interface CartLineItemProps {
  item: CartItem;
  onUpdate: (cartItemId: number, quantidade: number) => void;
  onRemove: (cartItemId: number) => void;
}

function CartLineItem({ item, onUpdate, onRemove }: CartLineItemProps) {
  const imageUrl = useProductImage(item.product_id);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
      <Link
        to={`/produtos/${item.product_id}`}
        className="block h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={item.product_nome} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff size={24} />
          </div>
        )}
      </Link>

      <div className="min-w-[160px] flex-1">
        <Link
          to={`/produtos/${item.product_id}`}
          className="font-semibold text-[#0B1B2B] hover:text-[#C36A2E]"
        >
          {item.product_nome}
        </Link>
        <p className="mt-1 text-xs text-[#1F3A5F]">Unitário: {formatPrice(item.preco_unitario)}</p>
      </div>

      <div className="flex items-center overflow-hidden rounded-full border border-gray-300">
        <button
          onClick={() => onUpdate(item.id, Math.max(1, item.quantidade - 1))}
          aria-label="Diminuir quantidade"
          className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-[#C36A2E] hover:text-white"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-medium text-[#0B1B2B]">{item.quantidade}</span>
        <button
          onClick={() => onUpdate(item.id, item.quantidade + 1)}
          aria-label="Aumentar quantidade"
          className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-[#C36A2E] hover:text-white"
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-24 text-right font-semibold text-[#0B1B2B]">{formatPrice(item.subtotal)}</p>

      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remover ${item.product_nome} do carrinho`}
        className="flex h-10 w-10 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export function Cart() {
  const navigate = useNavigate();
  const { cart, fetchCart, updateItem, removeItem } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cart) {
    return <div className="mx-auto max-w-7xl px-6 py-10 text-[#1F3A5F]">Carregando carrinho...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <ShoppingCart className="mx-auto mb-4 text-gray-300" size={48} />
        <h1 className="mb-2 text-2xl font-bold text-[#0B1B2B]">Seu carrinho está vazio</h1>
        <p className="mb-6 text-[#1F3A5F]">Adicione produtos para continuar suas compras.</p>
        <Link to="/produtos">
          <Button>Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold text-[#0B1B2B]">Carrinho de Compras</h1>

      <div className="grid w-full gap-8 lg:grid-cols-[1fr_320px]">
        <div className="h-fit w-full rounded-lg border border-gray-150 bg-white">
          <div className="border-b border-gray-150 px-5 py-4">
            <h2 className="font-semibold text-[#0B1B2B]">
              Produtos <span className="font-normal text-[#1F3A5F]">({cart.items.length})</span>
            </h2>
          </div>
          <div className="flex flex-col divide-y divide-gray-150">
            {cart.items.map((item) => (
              <CartLineItem key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
            ))}
          </div>
        </div>

        <div className="h-fit rounded-lg border border-gray-150 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 font-semibold text-[#0B1B2B]">Resumo do Pedido</h2>
          <div className="flex justify-between text-sm text-[#1F3A5F]">
            <span>Produtos ({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          <div className="my-3 border-t border-gray-150" />
          <div className="mb-5 flex justify-between text-lg font-bold text-[#0B1B2B]">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          <Button fullWidth onClick={() => navigate("/checkout")}>
            Finalizar Compra
          </Button>
          <Link to="/produtos">
            <Button variant="outline" fullWidth className="mt-3">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
