
  # Simple EJS HTML Page

  This is a code bundle for Simple EJS HTML Page. The original project is available at https://www.figma.com/design/CrO6hfjQLvFkxGjMb34MDv/Simple-EJS-HTML-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
  ## Backend (servidor de desenvolvimento)

  Um servidor Express mínimo está incluído em `server/index.js` para testes locais.

  Instalar e iniciar o servidor (PowerShell):

  ```powershell
  cd "c:\Users\R\Downloads\Simple EJS HTML Page (1)\server"
  npm install
  npm start
  ```

  Ou, a partir da raiz do projeto (adicionado o script `start:server`):

  ```powershell
  cd "c:\Users\R\Downloads\Simple EJS HTML Page (1)"
  npm run start:server
  ```

  Para rodar frontend + backend juntos com reload automático do servidor (requer instalar as dependências do root):

  ```powershell
  cd "c:\Users\R\Downloads\Simple EJS HTML Page (1)"
  npm install
  npm run dev:all
  ```
  