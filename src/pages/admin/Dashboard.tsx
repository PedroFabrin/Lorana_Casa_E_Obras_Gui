import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, AlertTriangle, Users, Package, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Dashboard as DashboardData } from "@/lib/types";

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data.data));
  }, []);

  if (!data) return <p className="text-sm text-[#45505A]">Carregando dashboard...</p>;

  const statusChartData = [
    { name: "Pendentes", total: data.pedidos_pendentes },
    { name: "Pagos", total: data.pedidos_pagos },
    { name: "Enviados", total: data.pedidos_enviados },
  ];

  const cards = [
    { label: "Faturamento (30 dias)", value: formatPrice(data.faturamento_30_dias), icon: DollarSign, color: "bg-green-500" },
    { label: "Pedidos Pendentes", value: String(data.pedidos_pendentes), icon: ShoppingCart, color: "bg-orange-500" },
    { label: "Produtos com Estoque Baixo", value: String(data.produtos_estoque_baixo.length), icon: AlertTriangle, color: "bg-red-500" },
    { label: "Total de Usuários", value: String(data.total_usuarios), icon: Users, color: "bg-blue-500" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F2A3F]">Dashboard</h1>
        <span className="text-xs text-[#45505A]">Faturamento últimos 7 dias: {formatPrice(data.faturamento_7_dias)}</span>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg border border-gray-150 bg-white p-5">
            <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-white ${color}`}>
              <Icon size={20} />
            </span>
            <p className="text-2xl font-bold text-[#0F2A3F]">{value}</p>
            <p className="text-sm text-[#45505A]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg border border-gray-150 bg-white p-5">
        <h2 className="mb-4 font-semibold text-[#0F2A3F]">Pedidos por Status</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={statusChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#0F2A3F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/produtos" className="flex items-center gap-3 rounded-lg border border-gray-150 bg-white p-5 hover:shadow-md">
          <Package className="text-[#B97A4F]" size={22} />
          <div>
            <p className="font-semibold text-[#0F2A3F]">Cadastrar Produto</p>
            <p className="text-sm text-[#45505A]">Adicione um novo produto ao catálogo</p>
          </div>
        </Link>
        <Link to="/admin/pedidos" className="flex items-center gap-3 rounded-lg border border-gray-150 bg-white p-5 hover:shadow-md">
          <ClipboardList className="text-[#B97A4F]" size={22} />
          <div>
            <p className="font-semibold text-[#0F2A3F]">Ver Pedidos</p>
            <p className="text-sm text-[#45505A]">Gerencie pedidos pendentes e ativos</p>
          </div>
        </Link>
      </div>

      {data.produtos_estoque_baixo.length > 0 && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4">
          <p className="mb-2 flex items-center gap-2 font-semibold text-red-900">
            <AlertTriangle size={18} /> Atenção: Produtos com Estoque Baixo
          </p>
          <ul className="text-sm text-red-700">
            {data.produtos_estoque_baixo.map((p) => (
              <li key={p.id}>
                {p.nome} (SKU {p.sku}) — {p.quantidade_estoque} unidades (mín. {p.estoque_minimo})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
