# Conexão Frontend ↔ Backend

Resumo rápido das mudanças que preparei para conectar o frontend ao backend em desenvolvimento, e como você pode reproduzir/testar.

**Arquivos modificados**
- [frontend/Simple EJS HTML Page (1)/src/app/services/api.ts](frontend/Simple%20EJS%20HTML%20Page%20(1)/src/app/services/api.ts)
- [frontend/Simple EJS HTML Page (1)/vite.config.ts](frontend/Simple%20EJS%20HTML%20Page%20(1)/vite.config.ts)
- [backend/profeiApi-main/assistenciaApi-main/src/main/java/com/example/profei/config/CorsConfig.java](backend/profeiApi-main/assistenciaApi-main/src/main/java/com/example/profei/config/CorsConfig.java)

O que foi feito
- O frontend agora usa `import.meta.env.VITE_API_URL || '/api'` em vez de URL fixa.
- O `vite.config.ts` recebeu um `server.proxy` que redireciona `/api/*` → `http://localhost:8080` durante o `npm run dev`.
- O backend (Spring WebFlux) recebeu `CorsConfig` permitindo origens locais (5173, 3000, 8080) para evitar bloqueios CORS em dev.

Comandos para rodar localmente (PowerShell)

Iniciar backend:
```powershell
Push-Location 'C:\Users\R\Desktop\repositorio\backend\profeiApi-main\assistenciaApi-main'
.\mvnw.cmd spring-boot:run
Pop-Location
```

Iniciar frontend (Vite):
```powershell
Push-Location 'C:\Users\R\Desktop\repositorio\frontend\Simple EJS HTML Page (1)'
npm run dev
Pop-Location
```

Testes rápidos
- Testar backend direto:
```bash
curl -i http://localhost:8080/documentos
```
- Testar via proxy do Vite (quando o Vite estiver rodando):
```bash
curl.exe -i http://localhost:5173/api/documentos
```

Configuração para build/produção
- Se você for buildar o frontend e quer apontar direto para a API sem proxy, crie um arquivo `.env` na raiz do frontend com:
```
VITE_API_URL=http://localhost:8080
```
Assim o `API_BASE_URL` será injetado durante o build.

Observações
- Se o Vite não responder via proxy, pare e reinicie o servidor do Vite (`Ctrl+C` no terminal do Vite, depois `npm run dev`).
- Para ajustar origens permitidas em produção, edite `CorsConfig.java` e reinicie o backend.

Se quiser, faço agora um pequeno commit com essas mudanças, ou crio um script `.env.example` no frontend. Qual você prefere? 
