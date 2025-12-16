import { FluxoAprovacao } from "../types/fluxo-aprovacao";
import { Edit, Trash2, GitBranch, CheckCircle, XCircle, Clock } from "lucide-react";

interface FluxoAprovacaoListProps {
  fluxos: FluxoAprovacao[];
  onEdit: (fluxo: FluxoAprovacao) => void;
  onDelete: (id: number) => void;
}

export function FluxoAprovacaoList({ fluxos, onEdit, onDelete }: FluxoAprovacaoListProps) {
  const getAcaoIcon = (acao: string) => {
    switch (acao) {
      case "Aprovado":
        return <CheckCircle className="size-5 text-green-600" />;
      case "Rejeitado":
        return <XCircle className="size-5 text-red-600" />;
      case "Em Análise":
        return <Clock className="size-5 text-yellow-600" />;
      default:
        return <GitBranch className="size-5 text-blue-600" />;
    }
  };

  const getAcaoColor = (acao: string) => {
    switch (acao) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Rejeitado":
        return "bg-red-100 text-red-800";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-800";
      case "Solicitado Revisão":
        return "bg-orange-100 text-orange-800";
      case "Arquivado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (fluxos.length === 0) {
    return (
      <div className="text-center py-12">
        <GitBranch className="size-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum fluxo de aprovação encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left p-4">Ação</th>
            <th className="text-left p-4">Documento</th>
            <th className="text-left p-4">Usuário</th>
            <th className="text-left p-4">Observação</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {fluxos.map((fluxo) => (
            <tr
              key={fluxo.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getAcaoIcon(fluxo.acao)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getAcaoColor(
                      fluxo.acao
                    )}`}
                  >
                    {fluxo.acao}
                  </span>
                </div>
              </td>
              <td className="p-4">{fluxo.documento}</td>
              <td className="p-4">{fluxo.usuario}</td>
              <td className="p-4">
                <div className="text-sm text-gray-600 max-w-md truncate">
                  {fluxo.observacao}
                </div>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(fluxo)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => fluxo.id && onDelete(fluxo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
