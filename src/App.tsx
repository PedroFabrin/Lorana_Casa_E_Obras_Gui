import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { RequireAuth, RequireAdmin } from "@/components/auth/Guards";

import { Home } from "@/pages/Home";
import { ProductList } from "@/pages/ProductList";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { PaymentReturn } from "@/pages/PaymentReturn";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";

import { Pedidos as AccountPedidos } from "@/pages/account/Pedidos";
import { PedidoDetail as AccountPedidoDetail } from "@/pages/account/PedidoDetail";
import { Dados } from "@/pages/account/Dados";
import { Enderecos } from "@/pages/account/Enderecos";

import { Dashboard } from "@/pages/admin/Dashboard";
import { Produtos as AdminProdutos } from "@/pages/admin/Produtos";
import { Pedidos as AdminPedidos } from "@/pages/admin/Pedidos";
import { PedidoDetail as AdminPedidoDetail } from "@/pages/admin/PedidoDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produtos/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route element={<RequireAuth />}>
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pagamento/sucesso" element={<PaymentReturn />} />
            <Route path="/pagamento/falha" element={<PaymentReturn />} />
            <Route path="/pagamento/pendente" element={<PaymentReturn />} />
            <Route path="/pagamento-concluido" element={<PaymentReturn />} />

            <Route path="/conta" element={<AccountLayout />}>
              <Route index element={<AccountPedidos />} />
              <Route path="pedidos/:id" element={<AccountPedidoDetail />} />
              <Route path="dados" element={<Dados />} />
              <Route path="enderecos" element={<Enderecos />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="pedidos/:id" element={<AdminPedidoDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
