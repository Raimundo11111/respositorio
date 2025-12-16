import { useState, useEffect } from "react";
import { FluxoAprovacao } from "../types/fluxo-aprovacao";
import { X } from "lucide-react";

interface FluxoAprovacaoFormProps {
  fluxo?: FluxoAprovacao;
  onSave: (fluxo: FluxoAprovacao) => void;
  onCancel: () => void;
}

export function FluxoAprovacaoForm({ fluxo, onSave, onCancel }: FluxoAprovacaoFormProps) {
  const [formData, setFormData] = useState<FluxoAprovacao>({
    acao: "",
    observacao: "",
    usuario: "",
    documento: "",
  });

  useEffect(() => {
    if (fluxo) {
      setFormData(fluxo);
    }
  }, [fluxo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2>{fluxo ? "Editar Fluxo de Aprovação" : "Novo Fluxo de Aprovação"}</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="acao" className="block mb-2 text-gray-700">
              Ação *
            </label>
            <select
              id="acao"
              name="acao"
              value={formData.acao}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a ação</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Rejeitado">Rejeitado</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Solicitado Revisão">Solicitado Revisão</option>
              <option value="Arquivado">Arquivado</option>
            </select>
          </div>

          <div>
            <label htmlFor="documento" className="block mb-2 text-gray-700">
              Documento *
            </label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
              placeholder="ID ou nome do documento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="usuario" className="block mb-2 text-gray-700">
              Usuário *
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              placeholder="Nome do usuário"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="observacao" className="block mb-2 text-gray-700">
              Observação *
            </label>
            <textarea
              id="observacao"
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Descreva o motivo da ação..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {fluxo ? "Atualizar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
