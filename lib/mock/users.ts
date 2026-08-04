export type MockUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Administrador" | "Corretor";
  status: "Ativo" | "Inativo";
};

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Filipe Tartaglia",
    email: "filipe@kenesis.com.br",
    phone: "(21) 99999-9999",
    role: "Administrador",
    status: "Ativo",
  },
  {
    id: "2",
    name: "João Corretor",
    email: "joao@kenesis.com.br",
    phone: "(21) 98888-8888",
    role: "Corretor",
    status: "Ativo",
  },
  {
    id: "3",
    name: "Maria Silva",
    email: "maria@kenesis.com.br",
    phone: "(21) 97777-7777",
    role: "Corretor",
    status: "Inativo",
  },
];
