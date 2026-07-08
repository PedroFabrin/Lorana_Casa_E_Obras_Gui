import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatOrderCode, formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pendente: ["cancelado"],
  pago: ["em_separacao", "cancelado"],
  em_separacao: ["enviado", "cancelado"],
  enviado: ["entregue", "cancelado"],
  entregue: [],
  cancelado: [],
  nao_aprovado: [],
};

export function PedidoDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  function load() {
    api.get(`/order/${id}`).then((res) => setOrder(res.data.data));
  }

  useEffect(load, [id]);

  async function handleStatusChange(status: OrderStatus) {
    setUpdating(true);
    setError("");
    try {
      await api.put("/order/update-status", { order_id: Number(id), status });
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  }

  async function handleConfirmPayment(aprovado: boolean) {
    setUpdating(true);
    setError("");
    try {
      await api.post(`/order/${id}/confirm-payment`, { aprovado });
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  }

  if (!order) return <p className="text-sm text-gray-500">Carregando pedido...</p>;

  const nextStatuses = transitions[order.status];
  const awaitingBoleto = order.payment?.forma_pagamento === "boleto" && order.status === "pendente";

  return (
    <div>
      <Link to="/admin/pedidos" className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-[#B97A4F]">
        <ArrowLeft size={16} /> Voltar para Pedidos
      </Link>

      <div className="rounded-lg border border-gray-150 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F2A3F]">{formatOrderCode(order.id, order.created_at)}</h2>
            <p className="text-sm text-gray-400">Realizado em {formatDate(order.created_at)} — Cliente #{order.user_id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-150 pt-4 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-gray-600">
                {item.product_nome} <span className="text-gray-400">x{item.quantidade}</span>
              </span>
              <span className="font-medium text-[#0F2A3F]">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-150 pt-4 text-lg font-bold text-[#0F2A3F]">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        {order.payment && (
          <div className="mt-5 rounded-md bg-gray-50 p-4 text-sm">
            <p className="font-semibold text-[#0F2A3F]">Pagamento</p>
            <p className="text-gray-600">Forma: {order.payment.forma_pagamento.toUpperCase()}</p>
            <p className="text-gray-600">Status: {order.payment.status}</p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {awaitingBoleto && (
          <div className="mt-5 flex flex-wrap gap-3">
            <Button disabled={updating} onClick={() => handleConfirmPayment(true)}>
              Confirmar Pagamento
            </Button>
            <Button variant="danger" disabled={updating} onClick={() => handleConfirmPayment(false)}>
              Rejeitar Pagamento
            </Button>
          </div>
        )}

        {nextStatuses.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-[#0F2A3F]">Atualizar status</p>
            <div className="flex flex-wrap gap-3">
              {nextStatuses.map((status) => (
                <Button key={status} variant="outline" disabled={updating} onClick={() => handleStatusChange(status)}>
                  Marcar como {status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
