import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatOrderCode, formatPrice } from "@/lib/format";
import { LAST_ORDER_KEY, PAYMENT_WINDOW_NAME } from "@/lib/payment";
import type { Order } from "@/lib/types";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 15;

export function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const orderId =
    searchParams.get("order_nsu") ??
    searchParams.get("external_reference") ??
    searchParams.get("order_id") ??
    localStorage.getItem(LAST_ORDER_KEY);
  const isPaymentPopup = window.name === PAYMENT_WINDOW_NAME;
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleRefresh() {
    setIsPolling(true);
    setRefreshKey((k) => k + 1);
  }

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;

    async function poll() {
      try {
        const { data } = await api.get(`/order/${orderId}`);
        if (cancelled) return;
        const fetched = data.data as Order;
        setOrder(fetched);
        attempts += 1;
        const keepPolling = fetched.status === "pendente" && attempts < MAX_POLL_ATTEMPTS;
        setIsPolling(keepPolling);
        if (keepPolling) {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, refreshKey]);

  const finalStatus = order !== null && order.status !== "pendente";
  useEffect(() => {
    if (!isPaymentPopup || !finalStatus) return;
    const timer = setTimeout(() => window.close(), 2500);
    return () => clearTimeout(timer);
  }, [isPaymentPopup, finalStatus]);

  if (!orderId || notFound) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <Clock size={40} className="text-[#45505A]" />
        <h1 className="text-xl font-bold text-[#0F2A3F]">Não foi possível confirmar automaticamente</h1>
        <p className="text-sm text-[#45505A]">
          Não conseguimos identificar seu pedido nesta página. Confira o status no seu histórico de pedidos.
        </p>
        <Link to="/conta">
          <Button>Ver meus pedidos</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center text-sm text-[#45505A]">
        Confirmando seu pagamento...
      </div>
    );
  }

  const Icon = order.status === "pago" ? CheckCircle2 : order.status === "nao_aprovado" || order.status === "cancelado" ? XCircle : Clock;
  const iconClass =
    order.status === "pago"
      ? "text-green-600"
      : order.status === "nao_aprovado" || order.status === "cancelado"
        ? "text-red-600"
        : "text-orange-500";

  const message = isPolling
    ? "Estamos confirmando seu pagamento, isso pode levar alguns instantes..."
    : order.status === "pago"
      ? "Pagamento aprovado! Seu pedido já está sendo processado."
      : order.status === "nao_aprovado" || order.status === "cancelado"
        ? "Não conseguimos confirmar seu pagamento. Você pode tentar novamente ou entrar em contato com o suporte."
        : "Ainda não recebemos a confirmação do pagamento. Se você já pagou, ela pode levar alguns minutos — use o botão abaixo para atualizar.";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <Icon size={40} className={iconClass} />
      <h1 className="text-xl font-bold text-[#0F2A3F]">{formatOrderCode(order.id, order.created_at)}</h1>
      <OrderStatusBadge status={order.status} />
      <p className="text-sm text-[#45505A]">{message}</p>
      <p className="text-sm font-medium text-[#0F2A3F]">
        Total: {formatPrice(order.total)} — realizado em {formatDate(order.created_at)}
      </p>
      {order.status === "pendente" && !isPolling && (
        <Button variant="outline" onClick={handleRefresh}>
          Atualizar status
        </Button>
      )}
      <Link to={`/conta/pedidos/${order.id}`}>
        <Button>Ver detalhes do pedido</Button>
      </Link>
    </div>
  );
}
