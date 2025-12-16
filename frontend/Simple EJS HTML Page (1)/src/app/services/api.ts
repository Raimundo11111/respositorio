import { Documento } from "../types/documento";
import { Usuario } from "../types/usuario";
import { Setor } from "../types/setor";
import { FluxoAprovacao } from "../types/fluxo-aprovacao";

// Use `VITE_API_URL` em produção ou rota proxy `/api` em desenvolvimento
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8081';

const TOKEN_KEY = 'app_token';
const USER_EMAIL_KEY = 'app_user_email';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string, email?: string) {
  localStorage.setItem(TOKEN_KEY, token);
  if (email) localStorage.setItem(USER_EMAIL_KEY, email);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
}

export const documentoService = {
  // Listar todos os documentos
  async findAll(): Promise<Documento[]> {
    const response = await fetch(`${API_BASE_URL}/documentos`);
    if (!response.ok) throw new Error("Erro ao buscar documentos");
    return response.json();
  },

  // Buscar documento por ID
  async findById(id: number): Promise<Documento> {
    const response = await fetch(`${API_BASE_URL}/documentos/${id}`);
    if (!response.ok) throw new Error("Documento não encontrado");
    return response.json();
  },

  // Criar novo documento
  async create(documento: Documento): Promise<Documento> {
    const token = getToken();
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/documentos`, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: JSON.stringify(documento),
    });
    if (!response.ok) throw new Error("Erro ao criar documento");
    return response.json();
  },

  // Atualizar documento
  async update(id: number, documento: Documento): Promise<Documento> {
    const token = getToken();
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/documentos/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(documento),
    });
    if (!response.ok) throw new Error("Erro ao atualizar documento");
    return response.json();
  },

  // Deletar documento
  async delete(id: number): Promise<void> {
    const token = getToken();
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/documentos/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Erro ao deletar documento");
  },
};

export const authService = {
  async register(nome: string, email: string, senha: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    if (!response.ok) throw new Error('Erro ao registrar');
    return response.json();
  },
  async login(email: string, senha: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    if (!response.ok) {
      const txt = await response.json().catch(()=>({error:'login failed'}));
      throw new Error(txt.error || 'Erro ao logar');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('app_token', data.token);
      localStorage.setItem('app_user_email', email);
    }
    return data.token;
  },
  logout() { localStorage.removeItem('app_token'); localStorage.removeItem('app_user_email'); }
};

export const fileService = {
  async uploadFile(file: File, titulo?: string, tipo?: string, onProgress?: (p:number)=>void) {
    const token = localStorage.getItem('app_token');
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const form = new FormData();
      form.append('file', file);
      if (titulo) form.append('titulo', titulo);
      if (tipo) form.append('tipo', tipo);
      xhr.open('POST', `${API_BASE_URL}/files/upload`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && onProgress) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          onProgress(pct);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText)); } catch(e){ resolve({}); }
        } else {
          // prefer server JSON error, fallback to statusText
          let msg = xhr.statusText || 'Erro ao enviar arquivo';
          try {
            const body = JSON.parse(xhr.responseText);
            if (body && body.error) msg = body.error;
          } catch(e){}
          if (xhr.status === 401) msg = msg || 'Não autorizado - faça login';
          reject(new Error(msg));
        }
      };
      xhr.onerror = () => reject(new Error('Erro na conexão'));
      xhr.send(form);
    });
  }
};

export const authHelpers = {
  getToken() { return localStorage.getItem('app_token'); },
  getUserEmail() { return localStorage.getItem('app_user_email'); }
};

export const usuarioService = {
  // Listar todos os usuários
  async findAll(): Promise<Usuario[]> {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return response.json();
  },

  // Buscar usuário por ID
  async findById(id: number): Promise<Usuario> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
    if (!response.ok) throw new Error("Usuário não encontrado");
    return response.json();
  },

  // Criar novo usuário
  async create(usuario: Usuario): Promise<Usuario> {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error("Erro ao criar usuário");
    return response.json();
  },

  // Atualizar usuário
  async update(id: number, usuario: Usuario): Promise<Usuario> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error("Erro ao atualizar usuário");
    return response.json();
  },

  // Deletar usuário
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar usuário");
  },
};

export const setorService = {
  // Listar todos os setores
  async findAll(): Promise<Setor[]> {
    const response = await fetch(`${API_BASE_URL}/setor`);
    if (!response.ok) throw new Error("Erro ao buscar setores");
    return response.json();
  },

  // Buscar setor por ID
  async findById(id: number): Promise<Setor> {
    const response = await fetch(`${API_BASE_URL}/setor/${id}`);
    if (!response.ok) throw new Error("Setor não encontrado");
    return response.json();
  },

  // Criar novo setor
  async create(setor: Setor): Promise<Setor> {
    const response = await fetch(`${API_BASE_URL}/setor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setor),
    });
    if (!response.ok) throw new Error("Erro ao criar setor");
    return response.json();
  },

  // Atualizar setor
  async update(id: number, setor: Setor): Promise<Setor> {
    const response = await fetch(`${API_BASE_URL}/setor/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setor),
    });
    if (!response.ok) throw new Error("Erro ao atualizar setor");
    return response.json();
  },

  // Deletar setor
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/setor/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar setor");
  },
};

export const fluxoAprovacaoService = {
  // Listar todos os fluxos de aprovação
  async findAll(): Promise<FluxoAprovacao[]> {
    const response = await fetch(`${API_BASE_URL}/fluxos-aprovacao`);
    if (!response.ok) throw new Error("Erro ao buscar fluxos de aprovação");
    return response.json();
  },

  // Buscar fluxo por ID
  async findById(id: number): Promise<FluxoAprovacao> {
    const response = await fetch(`${API_BASE_URL}/fluxos-aprovacao/${id}`);
    if (!response.ok) throw new Error("Fluxo de aprovação não encontrado");
    return response.json();
  },

  // Criar novo fluxo
  async create(fluxo: FluxoAprovacao): Promise<FluxoAprovacao> {
    const response = await fetch(`${API_BASE_URL}/fluxos-aprovacao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fluxo),
    });
    if (!response.ok) throw new Error("Erro ao criar fluxo de aprovação");
    return response.json();
  },

  // Atualizar fluxo
  async update(id: number, fluxo: FluxoAprovacao): Promise<FluxoAprovacao> {
    const response = await fetch(`${API_BASE_URL}/fluxos-aprovacao/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fluxo),
    });
    if (!response.ok) throw new Error("Erro ao atualizar fluxo de aprovação");
    return response.json();
  },

  // Deletar fluxo
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/fluxos-aprovacao/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar fluxo de aprovação");
  },
};