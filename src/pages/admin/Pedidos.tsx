import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatOrderCode, formatPrice } from "@/lib/format";
import type { Order, OrderStatus, User } from "@/lib/types";

const statusOptions: OrderStatus[] = ["pendente", "pago", "em_separacao", "enviado", "entregue", "cancelado", "nao_aprovado"];

export function Pedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post("/users/list", { page_size: 100 }).then((res) => setUsers(res.data.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .post("/order/list", { status: statusFilter || undefined, page_size: 100 })
      .then((res) => setOrders(res.data.data.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const visibleOrders = orders.filter((o) => {
    if (!search) return true;
    const code = formatOrderCode(o.id, o.created_at).toLowerCase();
    const clientName = userById.get(o.user_id)?.name.toLowerCase() ?? "";
    return code.includes(search.toLowerCase()) || clientName.includes(search.toLowerCase());
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F2A3F]">Gerenciamento de Pedidos</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por pedido ou cliente..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#B97A4F]"
        >
          <option value="">Todos os Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-sm text-gray-500">Carregando pedidos...</p>
        ) : visibleOrders.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum pedido encontrado.</p>
        ) : (
          visibleOrders.map((order) => (
            <div key={order.id} className="flex flex-col gap-4 rounded-lg border border-gray-150 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid grid-cols-2 gap-4 text-sm sm:flex sm:gap-8">
                <div>
                  <span className="block text-gray-400">Pedido</span>
                  <span className="font-semibold text-[#0F2A3F]">{formatOrderCode(order.id, order.created_at)}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Data</span>
                  <span className="font-medium text-[#0F2A3F]">{formatDate(order.created_at)}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Cliente</span>
                  <span className="font-medium text-[#0F2A3F]">{userById.get(order.user_id)?.name ?? `#${order.user_id}`}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Total</span>
                  <span className="font-medium text-[#0F2A3F]">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <Link to={`/admin/pedidos/${order.id}`} className="text-sm font-medium text-[#B97A4F] hover:underline">
                  Detalhes
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
