import { clsx } from "clsx";
import type { OrderStatus, StatusAtivo } from "@/lib/types";

const orderStatusMap: Record<OrderStatus, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-orange-100 text-orange-700 border border-orange-200" },
  pago: { label: "Pago", className: "bg-purple-100 text-purple-700 border border-purple-200" },
  em_separacao: { label: "Em Separação", className: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
  enviado: { label: "Enviado", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  entregue: { label: "Entregue", className: "bg-green-100 text-green-700 border border-green-200" },
  cancelado: { label: "Cancelado", className: "bg-red-100 text-red-700 border border-red-200" },
  nao_aprovado: { label: "Não Aprovado", className: "bg-red-100 text-red-700 border border-red-200" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const info = orderStatusMap[status];
  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap", info.className)}>
      {info.label}
    </span>
  );
}

export function AtivoStatusBadge({ status }: { status: StatusAtivo }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold",
        status === "ativo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
      )}
    >
      {status === "ativo" ? "Ativo" : "Inativo"}
    </span>
  );
}
