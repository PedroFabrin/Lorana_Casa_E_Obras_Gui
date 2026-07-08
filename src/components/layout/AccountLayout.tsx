import { ArrowLeft, ClipboardList, User, MapPin } from "lucide-react";
import { Link, NavLink, Outlet, useMatch } from "react-router-dom";
import { clsx } from "clsx";

const navItems = [
  { to: "/conta", label: "Meus Pedidos", icon: ClipboardList, end: true },
  { to: "/conta/dados", label: "Meus Dados", icon: User, end: false },
  { to: "/conta/enderecos", label: "Endereços", icon: MapPin, end: false },
];

export function AccountLayout() {
  const isPedidoDetail = useMatch("/conta/pedidos/:id");

  return (
    <div className="admin-theme flex-1">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-[#0F2A3F]">Minha Conta</h1>
          {isPedidoDetail && (
            <Link to="/conta" className="flex items-center gap-1 text-sm text-[#1F3A5F] hover:text-[#0B1B2B]">
              <ArrowLeft size={16} /> Voltar para Meus Pedidos
            </Link>
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <nav className="flex h-fit flex-col gap-1 rounded-lg border border-gray-150 bg-white p-3">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-[#B97A4F] text-white hover:bg-[#a56940]" : "text-[#0F2A3F] hover:bg-gray-100",
                  )
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
