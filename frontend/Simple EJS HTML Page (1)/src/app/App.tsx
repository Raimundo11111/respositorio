import { useState, useEffect, useRef } from "react";
import { Documento } from "./types/documento";
import { Usuario } from "./types/usuario";
import { Setor } from "./types/setor";
import { FluxoAprovacao } from "./types/fluxo-aprovacao";
import {
  documentoService,
  usuarioService,
  setorService,
  fluxoAprovacaoService,
} from "./services/api";
import { fileService, authHelpers } from "./services/api";
import { AuthForm } from "./components/AuthForm";
import { UploadModal } from "./components/UploadModal";
import { DocumentoList } from "./components/DocumentoList";
import { DocumentoForm } from "./components/DocumentoForm";
import { UsuarioList } from "./components/UsuarioList";
import { UsuarioForm } from "./components/UsuarioForm";
import { SetorList } from "./components/SetorList";
import { SetorForm } from "./components/SetorForm";
import { FluxoAprovacaoList } from "./components/FluxoAprovacaoList";
import { FluxoAprovacaoForm } from "./components/FluxoAprovacaoForm";
import { Dashboard } from "./components/Dashboard";
import {
  Plus,
  RefreshCw,
  FileText,
  AlertCircle,
  User,
  Building2,
  GitBranch,
  LayoutDashboard,
} from "lucide-react";

type TabType = "dashboard" | "documentos" | "usuarios" | "setores" | "fluxos";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para Documentos
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [showDocumentoForm, setShowDocumentoForm] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<Documento | undefined>();

  // Estados para Usuários
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showUsuarioForm, setShowUsuarioForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();

  // Estados para Setores
  const [setores, setSetores] = useState<Setor[]>([]);
  const [showSetorForm, setShowSetorForm] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Setor | undefined>();

  // Estados para Fluxos de Aprovação
  const [fluxos, setFluxos] = useState<FluxoAprovacao[]>([]);
  const [showFluxoForm, setShowFluxoForm] = useState(false);
  const [editingFluxo, setEditingFluxo] = useState<FluxoAprovacao | undefined>();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [token, setToken] = useState<string | null>(() => authHelpers.getToken());
  const [userEmail, setUserEmail] = useState<string | null>(() => authHelpers.getUserEmail());
  const [currentUserPerfil, setCurrentUserPerfil] = useState<string | null>(null);

  // Carregar dados baseado na aba ativa
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case "dashboard":
          // Carregar todos os dados para o dashboard
          try {
            const [docs, users, sects, flows] = await Promise.all([
              documentoService.findAll(),
              usuarioService.findAll(),
              setorService.findAll(),
              fluxoAprovacaoService.findAll(),
            ]);
            setDocumentos(docs);
            setUsuarios(users);
            setSetores(sects);
            setFluxos(flows);
          } catch (err) {
            // Usar dados mock se falhar
            throw err;
          }
          break;
        case "documentos":
          const docs = await documentoService.findAll();
          setDocumentos(docs);
          break;
        case "usuarios":
          const users = await usuarioService.findAll();
          setUsuarios(users);
          break;
        case "setores":
          const sects = await setorService.findAll();
          setSetores(sects);
          break;
        case "fluxos":
          const flows = await fluxoAprovacaoService.findAll();
          setFluxos(flows);
          break;
      }
    } catch (err) {
      setError("Erro ao carregar dados. Verifique se o servidor está rodando.");
      console.error(err);
      // Dados mock para demonstração
      if (activeTab === "dashboard" || activeTab === "documentos") {
        setDocumentos([
          {
            id: 1,
            titulo: "Relatório Mensal",
            tipo: "PDF",
            caminhoArquivo: "/docs/relatorio-mensal.pdf",
            status: "Aprovado",
            usuario: "João Silva",
            setor: "Financeiro",
          },
          {
            id: 2,
            titulo: "Proposta Comercial",
            tipo: "Word",
            caminhoArquivo: "/docs/proposta.docx",
            status: "Em Análise",
            usuario: "Maria Santos",
            setor: "Comercial",
          },
          {
            id: 3,
            titulo: "Planilha de Custos",
            tipo: "Excel",
            caminhoArquivo: "/docs/custos.xlsx",
            status: "Pendente",
            usuario: "Pedro Costa",
            setor: "Financeiro",
          },
        ]);
      }
      if (activeTab === "dashboard" || activeTab === "usuarios") {
        setUsuarios([
          {
            id: 1,
            nome: "João Silva",
            email: "joao@example.com",
            senhaHash: "******",
            perfil: "Administrador",
          },
          {
            id: 2,
            nome: "Maria Santos",
            email: "maria@example.com",
            senhaHash: "******",
            perfil: "Aprovador",
          },
          {
            id: 3,
            nome: "Pedro Costa",
            email: "pedro@example.com",
            senhaHash: "******",
            perfil: "Usuario",
          },
        ]);
      }
      if (activeTab === "dashboard" || activeTab === "setores") {
        setSetores([
          {
            id: 1,
            nome: "Financeiro",
            sigla: "FIN",
            descricao: "Setor responsável pela gestão financeira da empresa",
          },
          {
            id: 2,
            nome: "Comercial",
            sigla: "COM",
            descricao: "Setor responsável por vendas e relacionamento com clientes",
          },
          {
            id: 3,
            nome: "Recursos Humanos",
            sigla: "RH",
            descricao: "Setor responsável pela gestão de pessoas",
          },
        ]);
      }
      if (activeTab === "dashboard" || activeTab === "fluxos") {
        setFluxos([
          {
            id: 1,
            acao: "Aprovado",
            documento: "Relatório Mensal",
            usuario: "João Silva",
            observacao: "Documento aprovado sem ressalvas",
          },
          {
            id: 2,
            acao: "Em Análise",
            documento: "Proposta Comercial",
            usuario: "Maria Santos",
            observacao: "Aguardando análise do gestor",
          },
          {
            id: 3,
            acao: "Solicitado Revisão",
            documento: "Planilha de Custos",
            usuario: "João Silva",
            observacao: "Necessário ajustar valores do trimestre",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (userEmail) {
      usuarioService.findAll().then(users => {
        const u = users.find(x => x.email === userEmail);
        if (u) setCurrentUserPerfil((u as any).perfil || null);
      }).catch(()=>{});
    }
  }, [userEmail]);

  // Handlers para Documentos
  const handleSaveDocumento = async (documento: Documento) => {
    try {
      if (editingDocumento?.id) {
        await documentoService.update(editingDocumento.id, documento);
      } else {
        await documentoService.create(documento);
      }
      await loadData();
      setShowDocumentoForm(false);
      setEditingDocumento(undefined);
    } catch (err) {
      alert("Erro ao salvar documento. Verifique a conexão com o servidor.");
      console.error(err);
    }
  };

  const handleAuth = (newToken: string, email: string) => {
    setToken(newToken);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('app_token');
    localStorage.removeItem('app_user_email');
    setToken(null);
    setUserEmail(null);
    setCurrentUserPerfil(null);
  };

  const handleUploadClick = () => setShowUploadModal(true);

  const handleDeleteDocumento = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este documento?")) return;
    try {
      await documentoService.delete(id);
      await loadData();
    } catch (err) {
      alert("Erro ao deletar documento.");
      console.error(err);
    }
  };

  // Handlers para Usuários
  const handleSaveUsuario = async (usuario: Usuario) => {
    try {
      if (editingUsuario?.id) {
        await usuarioService.update(editingUsuario.id, usuario);
      } else {
        await usuarioService.create(usuario);
      }
      await loadData();
      setShowUsuarioForm(false);
      setEditingUsuario(undefined);
    } catch (err) {
      alert("Erro ao salvar usuário. Verifique a conexão com o servidor.");
      console.error(err);
    }
  };

  const handleDeleteUsuario = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;
    try {
      await usuarioService.delete(id);
      await loadData();
    } catch (err) {
      alert("Erro ao deletar usuário.");
      console.error(err);
    }
  };

  // Handlers para Setores
  const handleSaveSetor = async (setor: Setor) => {
    try {
      if (editingSetor?.id) {
        await setorService.update(editingSetor.id, setor);
      } else {
        await setorService.create(setor);
      }
      await loadData();
      setShowSetorForm(false);
      setEditingSetor(undefined);
    } catch (err) {
      alert("Erro ao salvar setor. Verifique a conexão com o servidor.");
      console.error(err);
    }
  };

  const handleDeleteSetor = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este setor?")) return;
    try {
      await setorService.delete(id);
      await loadData();
    } catch (err) {
      alert("Erro ao deletar setor.");
      console.error(err);
    }
  };

  // Handlers para Fluxos de Aprovação
  const handleSaveFluxo = async (fluxo: FluxoAprovacao) => {
    try {
      if (editingFluxo?.id) {
        await fluxoAprovacaoService.update(editingFluxo.id, fluxo);
      } else {
        await fluxoAprovacaoService.create(fluxo);
      }
      await loadData();
      setShowFluxoForm(false);
      setEditingFluxo(undefined);
    } catch (err) {
      alert("Erro ao salvar fluxo de aprovação. Verifique a conexão com o servidor.");
      console.error(err);
    }
  };

  const handleDeleteFluxo = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este fluxo de aprovação?")) return;
    try {
      await fluxoAprovacaoService.delete(id);
      await loadData();
    } catch (err) {
      alert("Erro ao deletar fluxo de aprovação.");
      console.error(err);
    }
  };

  const handleNew = () => {
    switch (activeTab) {
      case "documentos":
        setEditingDocumento(undefined);
        setShowDocumentoForm(true);
        break;
      case "usuarios":
        setEditingUsuario(undefined);
        setShowUsuarioForm(true);
        break;
      case "setores":
        setEditingSetor(undefined);
        setShowSetorForm(true);
        break;
      case "fluxos":
        setEditingFluxo(undefined);
        setShowFluxoForm(true);
        break;
    }
  };

  const tabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "documentos" as TabType, label: "Documentos", icon: FileText },
    { id: "usuarios" as TabType, label: "Usuários", icon: User },
    { id: "setores" as TabType, label: "Setores", icon: Building2 },
    { id: "fluxos" as TabType, label: "Fluxo de Aprovação", icon: GitBranch },
  ];

  if (!token) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="size-6 text-blue-600" />
              </div>
              <div>
                <h1>Sistema PROFEI</h1>
                <p className="text-gray-600">
                  Sistema de Gerenciamento de Documentos e Aprovações
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </button>
              {activeTab !== "dashboard" && (
                <button
                  onClick={handleNew}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="size-4" />
                  Novo
                </button>
              )}
              <div className="flex items-center gap-2">
                <button onClick={handleUploadClick} className="px-3 py-2 bg-green-600 text-white rounded">Enviar Arquivo</button>
                <button onClick={handleLogout} className="px-3 py-2 bg-red-600 text-white rounded">Sair</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800">{error}</p>
              <p className="text-sm text-yellow-700 mt-1">
                Usando dados de exemplo. Configure a URL da API em{" "}
                <code className="bg-yellow-100 px-1 py-0.5 rounded">
                  src/app/services/api.ts
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="size-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard
                  documentos={documentos}
                  usuarios={usuarios}
                  setores={setores}
                  fluxos={fluxos}
                />
              )}
              {activeTab === "documentos" && (
                <DocumentoList
                  documentos={documentos}
                  onEdit={(doc) => {
                    setEditingDocumento(doc);
                    setShowDocumentoForm(true);
                  }}
                  onDelete={handleDeleteDocumento}
                  onApprove={currentUserPerfil && (currentUserPerfil === 'Aprovador' || currentUserPerfil === 'Administrador') ? async (id:number)=>{
                    try{
                      const doc = documentos.find(d=>d.id===id);
                      if(!doc) return;
                      await documentoService.update(id, {...doc, status:'Aprovado'} as any);
                      await loadData();
                    }catch(e){alert('Erro ao aprovar')}
                  } : undefined}
                  onReject={currentUserPerfil && (currentUserPerfil === 'Aprovador' || currentUserPerfil === 'Administrador') ? async (id:number)=>{
                    try{
                      const doc = documentos.find(d=>d.id===id);
                      if(!doc) return;
                      await documentoService.update(id, {...doc, status:'Rejeitado'} as any);
                      await loadData();
                    }catch(e){alert('Erro ao rejeitar')}
                  } : undefined}
                />
              )}
              {activeTab === "usuarios" && (
                <UsuarioList
                  usuarios={usuarios}
                  onEdit={(user) => {
                    setEditingUsuario(user);
                    setShowUsuarioForm(true);
                  }}
                  onDelete={handleDeleteUsuario}
                />
              )}
              {activeTab === "setores" && (
                <SetorList
                  setores={setores}
                  onEdit={(setor) => {
                    setEditingSetor(setor);
                    setShowSetorForm(true);
                  }}
                  onDelete={handleDeleteSetor}
                />
              )}
              {activeTab === "fluxos" && (
                <FluxoAprovacaoList
                  fluxos={fluxos}
                  onEdit={(fluxo) => {
                    setEditingFluxo(fluxo);
                    setShowFluxoForm(true);
                  }}
                  onDelete={handleDeleteFluxo}
                />
              )}
            </>
          )}
        </div>

        {/* Forms */}
        {showDocumentoForm && (
          <DocumentoForm
            documento={editingDocumento}
            onSave={handleSaveDocumento}
            onCancel={() => {
              setShowDocumentoForm(false);
              setEditingDocumento(undefined);
            }}
          />
        )}
        {showUsuarioForm && (
          <UsuarioForm
            usuario={editingUsuario}
            onSave={handleSaveUsuario}
            onCancel={() => {
              setShowUsuarioForm(false);
              setEditingUsuario(undefined);
            }}
          />
        )}
        {showSetorForm && (
          <SetorForm
            setor={editingSetor}
            onSave={handleSaveSetor}
            onCancel={() => {
              setShowSetorForm(false);
              setEditingSetor(undefined);
            }}
          />
        )}
        {showFluxoForm && (
          <FluxoAprovacaoForm
            fluxo={editingFluxo}
            onSave={handleSaveFluxo}
            onCancel={() => {
              setShowFluxoForm(false);
              setEditingFluxo(undefined);
            }}
          />
        )}
        {showUploadModal && (
          <UploadModal onClose={()=>setShowUploadModal(false)} onUploaded={async ()=>{ await loadData(); }} />
        )}
      </div>
    </div>
  );
}