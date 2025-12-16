import { useState } from "react";
import { fileService } from "../services/api";

interface UploadModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

export function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("PDF");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const token = localStorage.getItem('app_token');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Selecione um arquivo");
    try {
      setLoading(true);
      await fileService.uploadFile(file, titulo || file.name, tipo, (p) => setProgress(p));
      onUploaded();
      setInfo('Arquivo enviado com sucesso');
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao enviar arquivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg mb-4">Enviar Documento</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block mb-1">Arquivo</label>
            <input type="file" onChange={(e)=>{
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setError(null);
                setInfo(null);
                setProgress(null);
                if (f) {
                  // auto-fill title from filename
                  if (!titulo) setTitulo(f.name);
                  // basic type detection by extension
                  const ext = f.name.split('.').pop()?.toLowerCase();
                  if (ext === 'pdf') setTipo('PDF');
                  else if (ext === 'doc' || ext === 'docx') setTipo('Word');
                  else if (ext === 'xls' || ext === 'xlsx') setTipo('Excel');
                  else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') setTipo('Imagem');
                  else setTipo('Outro');
                }
              }} />
          </div>
          <div>
            <label className="block mb-1">Título</label>
            <input value={titulo} onChange={e=>setTitulo(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Tipo</label>
            <select value={tipo} onChange={e=>setTipo(e.target.value)} className="w-full px-3 py-2 border rounded">
              <option>PDF</option>
              <option>Word</option>
              <option>Excel</option>
              <option>Imagem</option>
              <option>Outro</option>
            </select>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {info && <div className="text-green-600">{info}</div>}
          {progress !== null && (
            <div className="w-full bg-gray-200 rounded mt-2">
              <div className="bg-blue-600 text-white text-xs rounded" style={{width: `${progress}%`}}>{progress}%</div>
            </div>
          )}
          {!token && <div className="text-yellow-700">Você precisa entrar para enviar documentos.</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" disabled={loading || !token} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Enviando...':'Enviar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
