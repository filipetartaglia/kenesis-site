import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { getLeadById } from "@/server/leads/actions";
import { requirePermission } from "@/server/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Mail, Phone, Home, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("leads.read");
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Lead: ${lead.name}`}
        description="Detalhes completos do contato."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Informações de Contato</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-700">E-mail</p>
                <p className="text-sm text-gray-600">{lead.email || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-700">Telefone / WhatsApp</p>
                <p className="text-sm text-gray-600">
                  {lead.phone ? (
                    <a href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-kenesis-green hover:underline">
                      {lead.phone}
                    </a>
                  ) : "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-700">Data de Criação</p>
                <p className="text-sm text-gray-600">{new Date(lead.createdAt).toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Interesse & Status</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Home className="mt-1 text-gray-400" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-700">Imóvel</p>
                {lead.propertyTitle ? (
                  <Link href={`/imoveis/${lead.propertySlug}`} target="_blank" className="text-sm font-medium text-kenesis-green hover:underline">
                    {lead.propertyTitle}
                  </Link>
                ) : (
                  <p className="text-sm text-gray-600">Contato Geral</p>
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Status do Atendimento</p>
              <div className="inline-block">
                <LeadStatusSelect id={lead.id} status={lead.status} />
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <MessageSquare className="text-gray-400" size={20} />
          Mensagem do Cliente
        </h3>
        {lead.message ? (
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            {lead.message}
          </div>
        ) : (
          <p className="text-sm italic text-gray-500">Nenhuma mensagem adicional foi enviada.</p>
        )}
      </AdminCard>
    </div>
  );
}
