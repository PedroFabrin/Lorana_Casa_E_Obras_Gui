export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatOrderCode(id: number, createdAt: string): string {
  const year = new Date(createdAt).getFullYear();
  return `ORD-${year}-${String(id).padStart(3, "0")}`;
}
