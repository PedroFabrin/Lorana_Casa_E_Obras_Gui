export type Role = "admin" | "cliente";

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: Role;
}

export interface Address {
  id: number;
  user_id: number;
  rua: string;
  numero: string;
  cep: string;
  cidade: string;
  uf: string;
}

export type StatusAtivo = "ativo" | "inativo";

export interface Section {
  id: number;
  nome: string;
  descricao?: string | null;
  status: StatusAtivo;
}

export interface Category {
  id: number;
  section_id: number;
  nome: string;
  descricao?: string | null;
  status: StatusAtivo;
}

export interface Product {
  id: number;
  category_id: number;
  nome: string;
  descricao?: string | null;
  preco: number;
  preco_promocional?: number | null;
  sku: string;
  quantidade_estoque: number;
  estoque_minimo: number;
  peso?: number | null;
  dimensoes?: string | null;
  status: StatusAtivo;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  principal: boolean;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export type FormaPagamento = "cartao" | "boleto" | "pix";

export type OrderStatus =
  | "pendente"
  | "pago"
  | "em_separacao"
  | "enviado"
  | "entregue"
  | "cancelado"
  | "nao_aprovado";

export interface OrderItem {
  id: number;
  product_id: number;
  product_nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Payment {
  id: number;
  gateway: string;
  forma_pagamento: FormaPagamento;
  status: string;
  transaction_id: string;
  valor: number;
}

export interface Order {
  id: number;
  user_id: number;
  adress_id: number;
  status: OrderStatus;
  subtotal: number;
  desconto: number;
  total: number;
  created_at: string;
  items: OrderItem[];
  payment?: Payment | null;
}

export interface LowStockProduct {
  id: number;
  nome: string;
  sku: string;
  quantidade_estoque: number;
  estoque_minimo: number;
}

export interface Dashboard {
  faturamento_7_dias: number;
  faturamento_30_dias: number;
  pedidos_pendentes: number;
  pedidos_pagos: number;
  pedidos_enviados: number;
  produtos_estoque_baixo: LowStockProduct[];
  total_usuarios: number;
}

export interface Paginated<T> {
  total: number;
  page: number;
  page_size: number;
  data: T[];
}

export interface ApiSuccess<T> {
  status: "success";
  data: T;
}

export interface ApiMessage {
  status: "success";
  message: string;
}

export interface ApiError {
  status: "error";
  message: string;
}
