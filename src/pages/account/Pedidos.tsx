import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatOrderCode, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export function Pedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .post("/order/list", { page_size: 50 })
      .then((res) => setOrders(res.data.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Carregando pedidos...</p>;
  if (orders.length === 0) return <p className="text-sm text-gray-500">Você ainda não fez nenhum pedido.</p>;

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border border-gray-150 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="block text-[#45505A]">Pedido</span>
                <span className="font-semibold text-[#0F2A3F]">{formatOrderCode(order.id, order.created_at)}</span>
              </div>
              <div>
                <span className="block text-[#45505A]">Data</span>
                <span className="font-medium text-[#0F2A3F]">{formatDate(order.created_at)}</span>
              </div>
              <div>
                <span className="block text-[#45505A]">Total</span>
                <span className="font-medium text-[#0F2A3F]">{formatPrice(order.total)}</span>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex flex-col gap-1 text-sm text-[#45505A]">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.product_nome} <span className="text-gray-400">Qtd: {item.quantidade}</span>
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <Link
            to={`/conta/pedidos/${order.id}`}
            className="mt-4 inline-block rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-[#0F2A3F] hover:bg-gray-100"
          >
            Ver Detalhes
          </Link>
        </div>
      ))}
    </div>
  );
}
