export type MockLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  property: string;
  source: string;
  status: "Novo" | "Em atendimento" | "Finalizado";
  createdAt: string;
};

export const mockLeads: MockLead[] = [
  {
    id: "1",
    name: "Carlos Eduardo",
    phone: "(21) 96666-6666",
    email: "carlos@email.com",
    property: "Mansão no Jardim Ubá I",
    source: "WhatsApp",
    status: "Novo",
    createdAt: "2024-05-10T11:20:00Z",
  },
  {
    id: "2",
    name: "Ana Paula",
    phone: "(21) 95555-5555",
    email: "ana@email.com",
    property: "Residencial Pau Brasil",
    source: "Formulário Site",
    status: "Em atendimento",
    createdAt: "2024-05-09T16:45:00Z",
  },
  {
    id: "3",
    name: "Roberto",
    phone: "(11) 94444-4444",
    email: "roberto@email.com",
    property: "Contato Geral",
    source: "Instagram",
    status: "Finalizado",
    createdAt: "2024-05-01T09:00:00Z",
  },
];
