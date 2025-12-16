import { useState } from "react";
import { authService } from "../services/api";

interface AuthFormProps {
  onAuth: (token: string, email: string) => void;
}

export function AuthForm({ onAuth }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (isLogin) {
        const token = await authService.login(email, senha);
        onAuth(token, email);
      } else {
        await authService.register(nome, email, senha);
        setInfo('Cadastro realizado com sucesso. Faça login.');
        setIsLogin(true);
        setSenha('');
        setNome('');
      }
    } catch (err: any) {
      setError(err.message || 'Erro');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">{isLogin ? 'Entrar' : 'Cadastrar'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1">Nome</label>
              <input value={nome} onChange={e=>setNome(e.target.value)} className="w-full px-3 py-2 border rounded" required={!isLogin} />
            </div>
          )}
          <div>
            <label className="block mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1">Senha</label>
            <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {info && <div className="text-green-600">{info}</div>}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
            <button type="button" onClick={()=>setIsLogin(!isLogin)} className="flex-1 bg-gray-200 py-2 rounded">{isLogin ? 'Criar conta' : 'Já tenho conta'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
