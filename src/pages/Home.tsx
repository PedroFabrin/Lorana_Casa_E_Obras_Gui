import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, CreditCard, Zap, Droplet, Wrench, Paintbrush } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import type { Category, Product } from "@/lib/types";

const categoryIcons: Record<string, typeof Zap> = {
  "Elétrica": Zap,
  "Hidráulica": Droplet,
  "Ferramentas": Wrench,
  "Acabamentos": Paintbrush,
};


export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .post("/category/list", { status: "ativo", page_size: 4 })
      .then((res) => setCategories(res.data.data.data))
      .catch(() => setCategories([]));
    api
      .post("/product/list", { status: "ativo", page_size: 4 })
      .then((res) => setProducts(res.data.data.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-[#0A2540] to-[#1a3550] text-white">
        <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-6 py-16 sm:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold leading-tight">
              Tudo para sua Obra em um só lugar
            </h1>
            <p className="mt-4 text-gray-200">
              Materiais de construção com os melhores preços e qualidade garantida. Entrega
              rápida para toda região.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/produtos"
                className="inline-flex items-center gap-2 rounded-md bg-[#C36A2E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a85825]"
              >
                Ver Produtos <ArrowRight size={16} />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md border border-white bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#f9f5f0]">
                Fale Conosco
              </button>
            </div>
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#0A2540]">Categorias Principais</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.nome] ?? Wrench;
              return (
                <Link
                  key={cat.id}
                  to={`/produtos?category_id=${cat.id}`}
                  className="group flex w-[calc(50%-8px)] flex-col items-center gap-3 rounded-lg border border-gray-150 bg-gray-50 p-6 text-center transition-shadow hover:shadow-md sm:w-[calc(25%-12px)]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C36A2E] text-white">
                    <Icon size={24} />
                  </span>
                  <span className="font-semibold text-[#0A2540] group-hover:text-[#C36A2E]">{cat.nome}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0A2540]">Produtos em Destaque</h2>
            <Link to="/produtos" className="flex items-center gap-1 text-sm font-medium text-[#C36A2E] hover:underline">
              Ver Todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Entrega Rápida", text: "Receba seus produtos com agilidade e segurança em toda a região." },
              { icon: ShieldCheck, title: "Garantia de Qualidade", text: "Produtos certificados e com garantia do fabricante." },
              { icon: CreditCard, title: "Pagamento Facilitado", text: "Parcele suas compras no cartão ou pague via PIX com desconto." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 rounded-lg border border-gray-150 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#C36A2E]">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-[#0A2540]">{title}</h3>
                  <p className="text-sm text-[#4A5568]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
