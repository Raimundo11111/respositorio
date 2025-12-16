import { Documento } from "../types/documento";
import { Usuario } from "../types/usuario";
import { Setor } from "../types/setor";
import { FluxoAprovacao } from "../types/fluxo-aprovacao";
import {
  FileText,
  User,
  Building2,
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface DashboardProps {
  documentos: Documento[];
  usuarios: Usuario[];
  setores: Setor[];
  fluxos: FluxoAprovacao[];
}

export function Dashboard({ documentos, usuarios, setores, fluxos }: DashboardProps) {
  // Estatísticas gerais
  const stats = [
    {
      label: "Total de Documentos",
      value: documentos.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Usuários Ativos",
      value: usuarios.length,
      icon: User,
      color: "bg-green-100 text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Setores",
      value: setores.length,
      icon: Building2,
      color: "bg-purple-100 text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Fluxos de Aprovação",
      value: fluxos.length,
      icon: GitBranch,
      color: "bg-orange-100 text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Documentos por status
  const statusCount = documentos.reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
  }));

  const STATUS_COLORS = {
    Aprovado: "#22c55e",
    Rejeitado: "#ef4444",
    "Em Análise": "#eab308",
    Pendente: "#6b7280",
  };

  // Documentos por tipo
  const tipoCount = documentos.reduce((acc, doc) => {
    acc[doc.tipo] = (acc[doc.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tipoData = Object.entries(tipoCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Ações do fluxo de aprovação
  const acaoCount = fluxos.reduce((acc, fluxo) => {
    acc[fluxo.acao] = (acc[fluxo.acao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const acaoData = Object.entries(acaoCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Usuários por perfil
  const perfilCount = usuarios.reduce((acc, user) => {
    acc[user.perfil] = (acc[user.perfil] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const perfilData = Object.entries(perfilCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Documentos recentes (últimos 5)
  const recentDocumentos = documentos.slice(0, 5);

  // Atividades recentes do fluxo
  const recentFluxos = fluxos.slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="size-4 text-green-600" />;
      case "Rejeitado":
        return <XCircle className="size-4 text-red-600" />;
      case "Em Análise":
        return <Clock className="size-4 text-yellow-600" />;
      default:
        return <Clock className="size-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Rejeitado":
        return "bg-red-100 text-red-800";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-6 border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="size-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos por Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" />
            Documentos por Status
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] ||
                        "#6b7280"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Documentos por Tipo */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <FileText className="size-5 text-blue-600" />
            Documentos por Tipo
          </h3>
          {tipoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tipoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Fluxo de Aprovação */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <GitBranch className="size-5 text-blue-600" />
            Ações do Fluxo de Aprovação
          </h3>
          {acaoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={acaoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Usuários por Perfil */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <User className="size-5 text-blue-600" />
            Usuários por Perfil
          </h3>
          {perfilData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={perfilData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {perfilData.map((entry, index) => {
                    const colors = ["#8b5cf6", "#3b82f6", "#22c55e", "#6b7280"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </div>
      </div>

      {/* Listas de Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos Recentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="mb-4">Documentos Recentes</h3>
          {recentDocumentos.length > 0 ? (
            <div className="space-y-3">
              {recentDocumentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-blue-100 p-2 rounded">
                      <FileText className="size-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{doc.titulo}</p>
                      <p className="text-sm text-gray-500">{doc.tipo}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ml-2 ${getStatusColor(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum documento disponível
            </div>
          )}
        </div>

        {/* Atividades Recentes do Fluxo */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="mb-4">Atividades Recentes</h3>
          {recentFluxos.length > 0 ? (
            <div className="space-y-3">
              {recentFluxos.map((fluxo) => (
                <div
                  key={fluxo.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-orange-100 p-2 rounded flex-shrink-0">
                    <GitBranch className="size-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{fluxo.usuario}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{fluxo.acao}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {fluxo.documento}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {fluxo.observacao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma atividade disponível
            </div>
          )}
        </div>
      </div>

      {/* Resumo por Setor */}
      {setores.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <Building2 className="size-5 text-blue-600" />
            Setores Cadastrados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {setores.map((setor) => (
              <div
                key={setor.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-indigo-100 p-2 rounded">
                    <Building2 className="size-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-gray-500">{setor.sigla}</p>
                    <p>{setor.nome}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {setor.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
