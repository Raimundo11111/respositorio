import { Documento } from "../types/documento";
import { Edit, Trash2, FileText } from "lucide-react";

interface DocumentoListProps {
  documentos: Documento[];
  onEdit: (documento: Documento) => void;
  onDelete: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export function DocumentoList({ documentos, onEdit, onDelete }: DocumentoListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Rejeitado":
        return "bg-red-100 text-red-800";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-800";
      case "Pendente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoIcon = (tipo: string) => {
    return <FileText className="size-5 text-blue-600" />;
  };

  if (documentos.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="size-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum documento encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left p-4">Tipo</th>
            <th className="text-left p-4">Título</th>
            <th className="text-left p-4">Usuário</th>
            <th className="text-left p-4">Setor</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => (
            <tr
              key={doc.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getTipoIcon(doc.tipo)}
                  <span>{doc.tipo}</span>
                </div>
              </td>
              <td className="p-4">
                <div>
                  <div className="flex items-center gap-3">
                    {doc.tipo === 'Imagem' ? (
                      <img src={doc.caminhoArquivo.startsWith('http') ? doc.caminhoArquivo : `http://localhost:8081${doc.caminhoArquivo}`} alt={doc.titulo} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <img src="/images/doc-placeholder.svg" alt="doc" className="w-12 h-16 object-contain" />
                    )}
                    <div>
                      <div>{doc.titulo}</div>
                      <div className="text-sm text-gray-500">{doc.caminhoArquivo}</div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">{doc.usuario}</td>
              <td className="p-4">{doc.setor}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(doc)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => doc.id && onDelete(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  {onApprove && doc.id && (
                    <button
                      onClick={() => onApprove(doc.id as number)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      title="Aprovar"
                    >
                      Aprovar
                    </button>
                  )}
                  {onReject && doc.id && (
                    <button
                      onClick={() => onReject(doc.id as number)}
                      className="p-2 text-yellow-800 hover:bg-yellow-50 rounded-md transition-colors"
                      title="Rejeitar"
                    >
                      Rejeitar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
