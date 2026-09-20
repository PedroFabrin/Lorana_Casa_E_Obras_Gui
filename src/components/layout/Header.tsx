import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useLogout } from "@/hooks/useLogout";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";
import { LogoIcon } from "@/components/layout/LogoIcon";
import type { Category } from "@/lib/types";

export function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuthStore();
  const logout = useLogout();
  const { cart, itemCount, fetchCart } = useCartStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  useEffect(() => {
    api
      .post("/category/list", { status: "ativo", page_size: 10 })
      .then((res) => setCategories(res.data.data.data))
      .catch(() => setCategories([]));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(search ? `/produtos?q=${encodeURIComponent(search)}` : "/produtos");
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0B1B2B] text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:gap-6 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <LogoIcon height={28} />
          <div className="leading-tight">
            <div className="text-lg font-extrabold">LORANA</div>
            <div className="hidden text-[10px] uppercase tracking-wide text-white/60 sm:block">Casa &amp; Obras</div>
          </div>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <form onSubmit={handleSearch} className="w-full max-w-xl">
            <div className="flex w-full items-center rounded-md bg-white px-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full bg-transparent py-2 text-sm text-[#0B1B2B] outline-none placeholder:text-gray-400"
              />
              <button type="submit" aria-label="Buscar" className="text-[#1F3A5F] hover:text-[#A88F6A]">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 text-sm md:ml-0 md:gap-5">
          <Link
            to={user ? "/conta" : "/login"}
            aria-label={user ? user.name.split(" ")[0] : "Minha Conta"}
            className="flex items-center gap-1.5 rounded-md px-2 py-2 hover:bg-[#1F3A5F]"
          >
            <User size={20} />
            <span className="hidden md:inline">{user ? user.name.split(" ")[0] : "Minha Conta"}</span>
          </Link>
          {user && (
            <button
              type="button"
              aria-label="Sair"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-md px-2 py-2 hover:bg-[#1F3A5F]"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Sair</span>
            </button>
          )}
          <Link
            to="/carrinho"
            aria-label="Ver carrinho"
            className="relative flex items-center rounded-md p-2 hover:bg-[#1F3A5F]"
          >
            <ShoppingCart size={20} />
            {cart && itemCount() > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white">
                {itemCount()}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex items-center rounded-md p-2 hover:bg-[#1F3A5F] md:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-[#1F3A5F] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex gap-6 text-sm">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/produtos?category_id=${cat.id}`}
                className="border-b-2 border-transparent py-3 text-white/80 hover:border-orange-300 hover:text-orange-300"
              >
                {cat.nome}
              </Link>
            ))}
          </div>
          {user?.role === "admin" && (
            <Link to="/admin" className="py-3 text-sm font-medium text-[#A88F6A] hover:text-[#c9ab85]">
              Área Admin
            </Link>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-[#1F3A5F] px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4 flex items-center rounded-md bg-white px-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-transparent py-2.5 text-sm text-[#0B1B2B] outline-none placeholder:text-gray-400"
            />
            <button type="submit" aria-label="Buscar" className="text-[#1F3A5F] hover:text-[#A88F6A]">
              <Search size={18} />
            </button>
          </form>

          <div className="flex flex-col gap-1 text-sm">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/produtos?category_id=${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-white/80 hover:bg-[#1F3A5F]"
              >
                {cat.nome}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-2 py-2.5 font-medium text-[#A88F6A] hover:bg-[#1F3A5F]"
              >
                Área Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
