import type { TeamMember } from "@/types";

// Fonte em memória da equipe, temporária: vira linhas na tabela `users` com
// is_public = true. Cada um precisa de e-mail e senha próprios; quem não operar
// o painel entra com password_hash nulo — aparece na home, não faz login.
//
// Atenção ao campo `role` daqui: é CARGO ("CEO & Estratégia"). No banco,
// `role` é PERMISSÃO (admin | corretor) e o cargo se chama `job_title`. Se os
// dois se chamarem role na migração, alguém renderiza "admin" no card da home.

export const equipe: TeamMember[] = [
  {
    name: "Filipe Moura",
    role: "CEO & Estratégia",
    location: "Niterói, Rio de Janeiro",
    photo: "/team/filipe-moura.png",
    bio: "Sócio-fundador da Kenesis, Filipe é a mente por trás da estratégia e do posicionamento da marca. Com background em assessoria e serviços cartoriais, traz uma visão criativa e orientada a resultado — do planejamento ao marketing, conduz o negócio com propósito e consistência.",
    whatsapp: "5521976248282",
  },
  {
    name: "Filipe Tartaglia",
    role: "CEO & CTO · Corretor CRECI",
    location: "Niterói, Rio de Janeiro",
    photo: "/team/filipe-tartaglia.png",
    bio: "Co-fundador e o cérebro técnico da operação. Corretor credenciado que une inteligência de mercado com tecnologia de ponta — do sistema de gestão às estratégias de venda, é quem mantém a Kenesis sempre um passo à frente. Rigoroso, criterioso e obcecado por excelência.",
    whatsapp: "5521976248282",
  },
  {
    name: "Vinicius Rodrigues",
    role: "Relacionamento & Atendimento",
    location: "Niterói, Rio de Janeiro",
    photo: "/team/vinicius-rodrigues.png",
    bio: "O rosto do atendimento Kenesis. Vinicius tem o dom raro de fazer qualquer cliente se sentir em casa — negocia com maestria, se comunica com clareza e organiza a equipe de corretores com inteligência. É ele que transforma o primeiro contato em confiança.",
    whatsapp: "5521976248282",
  },
];
