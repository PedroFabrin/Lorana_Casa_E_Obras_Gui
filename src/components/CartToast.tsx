import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import { useCartToastStore } from "@/store/cartToast";

export function CartToast() {
  const { visible, productName, quantidade, hide } = useCartToastStore();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(hide, 5000);
    return () => clearTimeout(timer);
  }, [visible, hide]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="animate-toast-fade-in absolute inset-0 bg-black/40" onClick={hide} />
      <div className="animate-toast-in relative w-80 max-w-full rounded-lg border border-gray-150 bg-white p-5 shadow-xl">
        <button
          onClick={hide}
          aria-label="Fechar aviso"
          className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-[#0B1B2B]"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="mb-3 text-green-500" size={40} />
          <p className="font-semibold text-[#0B1B2B]">Adicionado ao carrinho</p>
          <p className="mt-1 line-clamp-2 text-sm text-[#1F3A5F]">{productName}</p>
          <p className="text-xs text-gray-400">{quantidade} {quantidade === 1 ? "unidade" : "unidades"}</p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            to="/carrinho"
            onClick={hide}
            className="rounded-md bg-[#C36A2E] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#a85825]"
          >
            Ir para o Carrinho
          </Link>
          <button
            onClick={hide}
            className="rounded-md px-4 py-2.5 text-center text-sm font-medium text-[#1F3A5F] hover:bg-gray-100"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
}
