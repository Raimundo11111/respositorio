import { Setor } from "../types/setor";
import { Edit, Trash2, Building2 } from "lucide-react";

interface SetorListProps {
  setores: Setor[];
  onEdit: (setor: Setor) => void;
  onDelete: (id: number) => void;
}

export function SetorList({ setores, onEdit, onDelete }: SetorListProps) {
  if (setores.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="size-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum setor encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left p-4">Sigla</th>
            <th className="text-left p-4">Nome</th>
            <th className="text-left p-4">Descrição</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {setores.map((setor) => (
            <tr
              key={setor.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Building2 className="size-4 text-indigo-600" />
                  </div>
                  <span className="font-mono">{setor.sigla}</span>
                </div>
              </td>
              <td className="p-4">{setor.nome}</td>
              <td className="p-4">
                <div className="text-sm text-gray-600 max-w-md truncate">
                  {setor.descricao}
                </div>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(setor)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => setor.id && onDelete(setor.id)}
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
