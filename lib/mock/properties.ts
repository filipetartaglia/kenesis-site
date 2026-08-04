export type MockProperty = {
  id: string;
  title: string;
  slug: string;
  category: string;
  city: string;
  price: string;
  status: "Ativo" | "Inativo" | "Vendido";
  createdAt: string;
  image: string;
};

export const mockProperties: MockProperty[] = [
  {
    id: "1",
    title: "Mansão no Jardim Ubá I",
    slug: "mansao-jardim-uba",
    category: "Alto padrão",
    city: "Niterói",
    price: "R$ 4.500.000",
    status: "Ativo",
    createdAt: "2024-01-15T10:00:00Z",
    image: "/imoveis/mansao-jardim-uba/01.webp",
  },
  {
    id: "2",
    title: "Residencial Pau Brasil",
    slug: "pau-brasil-sao-francisco",
    category: "Empreendimento",
    city: "Niterói",
    price: "Consulte",
    status: "Ativo",
    createdAt: "2024-02-20T14:30:00Z",
    image: "/imoveis/pau-brasil-sao-francisco/01.webp",
  },
  {
    id: "3",
    title: "Casa em Itaipu",
    slug: "casa-itaipu",
    category: "Casa",
    city: "Niterói",
    price: "R$ 1.200.000",
    status: "Vendido",
    createdAt: "2023-11-05T09:15:00Z",
    image: "",
  },
];
