import { Usuario } from "../types/usuario";
import { Edit, Trash2, User, Shield } from "lucide-react";

interface UsuarioListProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

export function UsuarioList({ usuarios, onEdit, onDelete }: UsuarioListProps) {
  const getPerfilBadge = (perfil: string) => {
    const styles = {
      Administrador: "bg-purple-100 text-purple-800",
      Aprovador: "bg-blue-100 text-blue-800",
      Gestor: "bg-green-100 text-green-800",
      Usuario: "bg-gray-100 text-gray-800",
    };
    return styles[perfil as keyof typeof styles] || styles.Usuario;
  };

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="size-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left p-4">Nome</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Perfil</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr
              key={usuario.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="size-4 text-blue-600" />
                  </div>
                  <span>{usuario.nome}</span>
                </div>
              </td>
              <td className="p-4">{usuario.email}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${getPerfilBadge(
                    usuario.perfil
                  )}`}
                >
                  {usuario.perfil === "Administrador" && <Shield className="size-3" />}
                  {usuario.perfil}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(usuario)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => usuario.id && onDelete(usuario.id)}
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
