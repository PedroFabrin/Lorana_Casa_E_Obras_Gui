import { useEffect, useState, type RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { formatOrderCode, formatPrice } from "@/lib/format";
import { openPaymentWindow } from "@/lib/payment";
import type { CheckoutResult, Order } from "@/lib/types";

const POLL_INTERVAL_MS = 3000;

interface PaymentPendingProps {
  order: CheckoutResult;
  popupRef: RefObject<Window | null>;
}

export function PaymentPending({ order, popupRef }: PaymentPendingProps) {
  const navigate = useNavigate();
  const [popupClosed, setPopupClosed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const { data } = await api.get(`/order/${order.id}`);
        if (cancelled) return;
        if ((data.data as Order).status !== "pendente") {
          popupRef.current?.close();
          navigate(`/conta/pedidos/${order.id}`, { replace: true });
          return;
        }
      } catch {
        // falha temporária de rede: tenta de novo no próximo ciclo
      }
      if (!cancelled) timer = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [order.id, navigate, popupRef]);

  useEffect(() => {
    const check = () => {
      const popup = popupRef.current;
      setPopupClosed(!popup || popup.closed);
    };
    const first = setTimeout(check, 0);
    const interval = setInterval(check, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [popupRef]);

  function handleOpen() {
    popupRef.current = openPaymentWindow(order.checkout_url ?? "");
    setPopupClosed(!popupRef.current);
  }

  return (
    <div className="admin-theme flex-1">
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <Clock size={40} className="text-orange-500" />
        <h1 className="text-xl font-bold text-[#0F2A3F]">Aguardando pagamento</h1>
        <p className="text-sm font-medium text-[#0F2A3F]">
          {formatOrderCode(order.id, order.created_at)} — {formatPrice(order.total)}
        </p>
        <p className="text-sm text-[#45505A]">
          {popupClosed
            ? "A janela de pagamento foi fechada ou bloqueada pelo navegador. Abra novamente para concluir o pagamento no Mercado Pago."
            : "Conclua o pagamento na janela do Mercado Pago. Esta página atualiza sozinha quando o pagamento for confirmado — a confirmação pode levar alguns minutos."}
        </p>
        {popupClosed && <Button onClick={handleOpen}>Abrir pagamento</Button>}
        <Link to={`/conta/pedidos/${order.id}`} className="text-sm font-medium text-[#B97A4F] hover:underline">
          Ver detalhes do pedido
        </Link>
      </div>
    </div>
  );
}
