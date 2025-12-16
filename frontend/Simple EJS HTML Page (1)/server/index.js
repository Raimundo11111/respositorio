import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
const db = {
  documentos: [],
  usuarios: [],
  setores: [],
  fluxos: [],
};

let idCounter = 1;

function getNextId() {
  return idCounter++;
}

// Generic handlers generator
function registerCrudRoutes(name) {
  app.get(`/${name}`, (req, res) => {
    res.json(db[name]);
  });

  app.get(`/${name}/:id`, (req, res) => {
    const item = db[name].find((i) => i.id === Number(req.params.id));
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  app.post(`/${name}`, (req, res) => {
    const item = { id: getNextId(), ...req.body };
    db[name].push(item);
    res.status(201).json(item);
  });

  app.put(`/${name}/:id`, (req, res) => {
    const idx = db[name].findIndex((i) => i.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    db[name][idx] = { ...db[name][idx], ...req.body };
    res.json(db[name][idx]);
  });

  app.delete(`/${name}/:id`, (req, res) => {
    const idx = db[name].findIndex((i) => i.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    db[name].splice(idx, 1);
    res.status(204).end();
  });
}

registerCrudRoutes("documentos");
registerCrudRoutes("usuarios");
registerCrudRoutes("setores");
registerCrudRoutes("fluxos");

// Seed some sample data
db.usuarios.push({ id: getNextId(), nome: "Admin" });
db.setores.push({ id: getNextId(), nome: "TI" });
db.documentos.push({ id: getNextId(), titulo: "Documento Exemplo", tipo: "Relatório", caminhoArquivo: "doc.pdf", status: "Ativo", usuario: "Admin", setor: "TI" });
db.fluxos.push({ id: getNextId(), nome: "Fluxo Padrão", etapas: [] });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
