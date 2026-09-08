import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CreditCard, QrCode } from "lucide-react";
import { clsx } from "clsx";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import type { Address, CheckoutResult, FormaPagamento } from "@/lib/types";

const steps = ["Identificação", "Entrega", "Pagamento"] as const;

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ rua: "", numero: "", cep: "", cidade: "", uf: "" });
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("cartao");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!user) return;
    api.post("/adress/list", { user_id: user.id, page_size: 50 }).then((res) => {
      const list = res.data.data.data as Address[];
      setAddresses(list);
      if (list.length > 0) setAddressId(list[0].id);
      else setShowNewAddress(true);
    });
  }, [user]);

  async function handleCreateAddress() {
    setError("");
    try {
      const { data } = await api.post("/adress/create", newAddress);
      setAddresses((prev) => [...prev, data.data]);
      setAddressId(data.data.id);
      setShowNewAddress(false);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  async function handleFinish() {
    if (!addressId) {
      setError("Selecione um endereço de entrega.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post<{ data: CheckoutResult }>("/order/checkout", {
        adress_id: addressId,
        forma_pagamento: formaPagamento,
      });
      await fetchCart();
      if (data.data.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        navigate(`/conta/pedidos/${data.data.id}`);
      }
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center text-[#1F3A5F]">
        Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.
      </div>
    );
  }

  return (
    <div className="admin-theme flex-1">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold text-[#0F2A3F]">Finalizar Compra</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-lg border border-gray-150 bg-white p-6">
            <div className="mb-8 flex items-center">
              {steps.map((label, i) => (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={clsx(
                        "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                        i < step
                          ? "bg-[#B97A4F] text-white"
                          : i === step
                            ? "border-2 border-[#B97A4F] text-[#B97A4F]"
                            : "border-2 border-gray-200 text-gray-400",
                      )}
                    >
                      {i < step ? <Check size={16} /> : i + 1}
                    </div>
                    <span className="text-xs font-medium text-[#0F2A3F]">{label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={clsx("mx-2 h-0.5 flex-1", i < step ? "bg-[#B97A4F]" : "bg-gray-200")} />
                  )}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div>
                <h2 className="mb-4 font-semibold text-[#0F2A3F]">Identificação</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-[#45505A]">Nome Completo</span>
                    <span className="font-medium text-[#0F2A3F]">{user?.name}</span>
                  </div>
                  <div>
                    <span className="block text-[#45505A]">E-mail</span>
                    <span className="font-medium text-[#0F2A3F]">{user?.email}</span>
                  </div>
                  <div>
                    <span className="block text-[#45505A]">CPF</span>
                    <span className="font-medium text-[#0F2A3F]">{user?.cpf}</span>
                  </div>
                </div>
                <Button className="mt-6" onClick={() => setStep(1)}>
                  Continuar
                </Button>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="mb-4 font-semibold text-[#0F2A3F]">Endereço de Entrega</h2>
                <div className="flex flex-col gap-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={clsx(
                        "flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm",
                        addressId === addr.id ? "border-[#B97A4F] bg-[#B97A4F]/10" : "border-gray-300",
                      )}
                    >
                      <input
                        type="radio"
                        checked={addressId === addr.id}
                        onChange={() => setAddressId(addr.id)}
                        className="mt-1 accent-[#B97A4F]"
                      />
                      <span className="text-[#0F2A3F]">
                        {addr.rua}, {addr.numero} — {addr.cidade}/{addr.uf} — CEP {addr.cep}
                      </span>
                    </label>
                  ))}
                </div>

                {!showNewAddress ? (
                  <button
                    onClick={() => setShowNewAddress(true)}
                    className="mt-3 text-sm font-medium text-[#B97A4F] hover:underline"
                  >
                    + Novo endereço
                  </button>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <input
                      placeholder="CEP"
                      value={newAddress.cep}
                      onChange={(e) => setNewAddress({ ...newAddress, cep: e.target.value })}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
                    />
                    <input
                      placeholder="Rua"
                      value={newAddress.rua}
                      onChange={(e) => setNewAddress({ ...newAddress, rua: e.target.value })}
                      className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
                    />
                    <input
                      placeholder="Número"
                      value={newAddress.numero}
                      onChange={(e) => setNewAddress({ ...newAddress, numero: e.target.value })}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
                    />
                    <input
                      placeholder="Cidade"
                      value={newAddress.cidade}
                      onChange={(e) => setNewAddress({ ...newAddress, cidade: e.target.value })}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
                    />
                    <input
                      placeholder="UF"
                      maxLength={2}
                      value={newAddress.uf}
                      onChange={(e) => setNewAddress({ ...newAddress, uf: e.target.value.toUpperCase() })}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#B97A4F]"
                    />
                    <Button className="col-span-2" variant="outline" onClick={handleCreateAddress}>
                      Salvar endereço
                    </Button>
                  </div>
                )}

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Voltar
                  </Button>
                  <Button disabled={!addressId} onClick={() => setStep(2)}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-4 font-semibold text-[#0F2A3F]">Pagamento</h2>
                <div className="flex flex-col gap-3">
                  {([
                    { value: "cartao", label: "Cartão de Crédito", icon: CreditCard, hint: "Aprovação imediata" },
                    { value: "pix", label: "PIX", icon: QrCode, hint: "Aprovação imediata" },
                    { value: "boleto", label: "Boleto Bancário", icon: CreditCard, hint: "Confirmação em até 2 dias úteis" },
                  ] as const).map(({ value, label, icon: Icon, hint }) => (
                    <label
                      key={value}
                      className={clsx(
                        "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm",
                        formaPagamento === value ? "border-[#B97A4F] bg-[#B97A4F]/10" : "border-gray-300",
                      )}
                    >
                      <input
                        type="radio"
                        checked={formaPagamento === value}
                        onChange={() => setFormaPagamento(value)}
                        className="accent-[#B97A4F]"
                      />
                      <Icon size={18} className="text-[#0F2A3F]" />
                      <span className="flex-1 font-medium text-[#0F2A3F]">{label}</span>
                      <span className="text-xs text-[#45505A]">{hint}</span>
                    </label>
                  ))}
                </div>

                {formaPagamento === "pix" && (
                  <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    Pagamento via PIX é aprovado imediatamente após a confirmação do pedido.
                  </div>
                )}

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button disabled={submitting} onClick={handleFinish}>
                    {submitting ? "Finalizando..." : "Finalizar Pedido"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="h-fit rounded-lg border border-gray-150 bg-white p-5 lg:sticky lg:top-24">
            <h2 className="mb-4 font-semibold text-[#0F2A3F]">Resumo do Pedido</h2>
            <div className="flex flex-col gap-2 text-sm">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-[#45505A]">
                    {item.product_nome} <span className="text-gray-400">x{item.quantidade}</span>
                  </span>
                  <span className="font-medium text-[#0F2A3F]">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="my-3 border-t border-gray-150" />
            <div className="flex justify-between text-lg font-bold text-[#0F2A3F]">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
