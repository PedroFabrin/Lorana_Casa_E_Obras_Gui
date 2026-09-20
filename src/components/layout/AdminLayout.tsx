import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, ArrowLeft, LogOut } from "lucide-react";
import { clsx } from "clsx";
import { LogoIcon } from "@/components/layout/LogoIcon";
import { useLogout } from "@/hooks/useLogout";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package, end: false },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList, end: false },
];

export function AdminLayout() {
  const logout = useLogout();

  return (
    <div className="admin-theme flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0A2540] px-4 py-3 text-white md:px-6">
        <Link to="/admin" className="flex items-center gap-2">
          <LogoIcon height={28} />
          <div className="leading-tight">
            <div className="text-sm font-extrabold">LORANA</div>
            <div className="hidden text-xs font-bold uppercase tracking-wide text-gray-300 sm:block">Painel Administrativo</div>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/" aria-label="Voltar à loja" className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-white/80 hover:bg-[#1a3550]">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Voltar à Loja</span>
          </Link>
          <button
            type="button"
            aria-label="Sair"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-white/80 hover:bg-[#1a3550]"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block">
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-[#B97A4F] text-white" : "text-[#4A5568] hover:bg-gray-100",
                  )
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 pb-24 md:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-gray-200 bg-white lg:hidden">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium",
                isActive ? "text-[#B97A4F]" : "text-[#4A5568]",
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
