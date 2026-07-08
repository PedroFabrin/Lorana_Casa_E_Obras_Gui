import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { LogoIcon } from "@/components/layout/LogoIcon";

export function Footer() {
  return (
    <footer className="bg-[#0B1B2B] text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-white">
            <LogoIcon height={28} />
            <div>
              <div className="font-extrabold leading-tight">LORANA</div>
              <div className="text-[10px] uppercase tracking-wide text-white/60">Casa &amp; Obras</div>
            </div>
          </div>
          <p className="text-sm">
            Sua loja completa para construção e reforma. Qualidade e confiança há mais de 20 anos.
          </p>
          <div className="mt-4 flex gap-2">
            {["f", "in", "ig"].map((label) => (
              <span
                key={label}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F3A5F] text-xs font-semibold uppercase text-white hover:bg-[#A88F6A]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Links Rápidos</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/" className="hover:text-[#A88F6A]">Home</Link></li>
            <li><Link to="/produtos" className="hover:text-[#A88F6A]">Produtos</Link></li>
            <li><Link to="/conta" className="hover:text-[#A88F6A]">Minha Conta</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Categorias</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/produtos" className="hover:text-[#A88F6A]">Elétrica</Link></li>
            <li><Link to="/produtos" className="hover:text-[#A88F6A]">Hidráulica</Link></li>
            <li><Link to="/produtos" className="hover:text-[#A88F6A]">Ferramentas</Link></li>
            <li><Link to="/produtos" className="hover:text-[#A88F6A]">Acabamentos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Contato</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16} /> Rua da Construção, 1000 - São Paulo - SP</li>
            <li className="flex items-center gap-2"><Phone size={16} /> (11) 3000-0000</li>
            <li className="flex items-center gap-2"><Mail size={16} /> contato@lorana.com.br</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
