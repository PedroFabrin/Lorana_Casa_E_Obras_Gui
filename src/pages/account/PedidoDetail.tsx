import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatOrderCode, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export function PedidoDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    api.get(`/order/${id}`).then((res) => setOrder(res.data.data));
  }, [id]);

  if (!order) return <p className="text-sm text-[#45505A]">Carregando pedido...</p>;

  return (
    <div>
      <div className="rounded-lg border border-gray-150 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0F2A3F]">{formatOrderCode(order.id, order.created_at)}</h2>
            <p className="text-sm text-[#45505A]">Realizado em {formatDate(order.created_at)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-150 pt-4 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-[#45505A]">
                {item.product_nome} <span className="text-gray-400">x{item.quantidade}</span>
              </span>
              <span className="font-medium text-[#0F2A3F]">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-gray-150 pt-4 text-sm">
          <div className="flex justify-between text-[#45505A]">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.desconto > 0 && (
            <div className="flex justify-between text-[#45505A]">
              <span>Desconto</span>
              <span>-{formatPrice(order.desconto)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-[#0F2A3F]">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {order.payment && (
          <div className="mt-5 rounded-md bg-gray-50 p-4 text-sm">
            <p className="font-semibold text-[#0F2A3F]">Pagamento</p>
            <p className="text-[#45505A]">Forma: {order.payment.forma_pagamento.toUpperCase()}</p>
            <p className="text-[#45505A]">Status: {order.payment.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
