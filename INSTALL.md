# 📦 Guia de Instalação Completo - Windows

Este guia vai te ajudar a instalar tudo que é necessário para rodar o projeto News API Backend no Windows.

## 🎯 O que você precisa instalar

1. **Node.js** (v18 ou superior) - Runtime JavaScript
2. **PostgreSQL** (v12 ou superior) - Banco de dados
3. **Git** (opcional, mas recomendado) - Controle de versão
4. **Dependências do projeto** (via npm)

---

## 📥 Passo 1: Instalar Node.js

### Opção 1: Download direto (Recomendado)

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (Long Term Support) - recomendado
3. Execute o instalador `.msi`
4. Siga o assistente de instalação (aceite os padrões)
5. **Importante**: Marque a opção "Automatically install the necessary tools" se aparecer

### Opção 2: Via Chocolatey (se você tem)

```powershell
choco install nodejs-lts
```

### Verificar instalação

Abra o **PowerShell** ou **Prompt de Comando** e execute:

```powershell
node --version
npm --version
```

Você deve ver algo como:
```
v18.17.0
9.6.7
```

✅ Se aparecer as versões, Node.js está instalado corretamente!

---

## 🐘 Passo 2: Instalar PostgreSQL

### Download e Instalação

1. Acesse: https://www.postgresql.org/download/windows/
2. Clique em "Download the installer"
3. Baixe o instalador (recomendo a versão mais recente)
4. Execute o instalador `.exe`

### Durante a instalação:

1. **Porta**: Deixe a porta padrão `5432` (ou anote se mudar)
2. **Senha do superusuário (postgres)**: 
   - **IMPORTANTE**: Anote essa senha! Você vai precisar dela.
   - Exemplo: `postgres123` (use uma senha segura)
3. **Locale**: Deixe o padrão ou escolha `Portuguese, Brazil`
4. Complete a instalação

### Verificar instalação

1. Abra o **pgAdmin 4** (instalado junto com PostgreSQL)
   - Ou use o **SQL Shell (psql)** no menu Iniciar
2. Teste a conexão com a senha que você definiu

✅ Se conseguir conectar, PostgreSQL está funcionando!

---

## 🔧 Passo 3: Configurar o Projeto

### 3.1. Navegar até a pasta do projeto

Abra o **PowerShell** ou **Prompt de Comando** e vá até a pasta do projeto:

```powershell
cd C:\Users\joaog\Cursor\news-api
```

### 3.2. Instalar dependências do projeto

Execute:

```powershell
npm install
```

Isso vai instalar automaticamente todas as bibliotecas necessárias:
- express
- sequelize
- pg (PostgreSQL client)
- jsonwebtoken
- bcrypt
- axios
- e todas as outras dependências listadas no `package.json`

⏳ Isso pode levar alguns minutos na primeira vez.

### 3.3. Criar arquivo de configuração (.env)

Crie um arquivo chamado `.env` na pasta `news-api` com o seguinte conteúdo:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=news_db
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_POSTGRES_AQUI

# JWT Configuration
JWT_SECRET=seu-secret-jwt-super-seguro-mude-isso-em-producao
JWT_EXPIRES_IN=7d

# News API - chave global (usada por todos os usuários)
NEWS_API_KEY=sua-chave-da-newsapi-org

# Email Configuration (opcional por enquanto)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**⚠️ IMPORTANTE**: 
- Substitua `SUA_SENHA_POSTGRES_AQUI` pela senha que você definiu ao instalar o PostgreSQL
- Mude o `JWT_SECRET` para algo único e seguro

### 3.4. Criar o banco de dados

Você tem duas opções:

#### Opção A: Via pgAdmin 4 (Interface Gráfica)

1. Abra o **pgAdmin 4**
2. Conecte-se ao servidor (use a senha do postgres)
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `news_db`
5. Clique em "Save"

#### Opção B: Via SQL Shell (psql)

1. Abra o **SQL Shell (psql)** no menu Iniciar
2. Pressione Enter para todas as opções (host, porta, database, usuário)
3. Digite a senha do postgres quando solicitado
4. Execute:

```sql
CREATE DATABASE news_db;
```

5. Digite `\q` para sair

---

## 🚀 Passo 4: Rodar o Projeto

### Modo Desenvolvimento (com auto-reload)

```powershell
npm run dev
```

### Modo Produção

```powershell
npm start
```

### Verificar se está funcionando

Você deve ver algo como:

```
✅ Conexão com o banco de dados estabelecida com sucesso!
✅ Modelos sincronizados com sucesso!
🚀 Servidor rodando na porta 3000
📡 Ambiente: development
🔗 API disponível em: http://localhost:3000
```

Abra o navegador e acesse: **http://localhost:3000**

Você deve ver:
```json
{
  "success": true,
  "message": "News API Backend - API está funcionando!",
  "version": "1.0.0"
}
```

✅ **Pronto! Seu backend está rodando!**

---

## 🧪 Testar a API

### Teste rápido com PowerShell

#### 1. Registrar um usuário:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"teste@example.com","password":"senha123","favoriteTopics":["crypto"],"emailFrequency":"daily"}'
```

#### 2. Fazer login:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"teste@example.com","password":"senha123"}'
```

---

## ❓ Solução de Problemas Comuns

### Erro: "Cannot find module"

**Solução**: Execute `npm install` novamente na pasta do projeto

### Erro: "password authentication failed"

**Solução**: Verifique se a senha no arquivo `.env` está correta

### Erro: "database does not exist"

**Solução**: Crie o banco de dados `news_db` no PostgreSQL

### Erro: "port 3000 is already in use"

**Solução**: 
- Mude a porta no arquivo `.env` (ex: `PORT=3001`)
- Ou feche o programa que está usando a porta 3000

### PostgreSQL não inicia

**Solução**: 
1. Abra "Services" (Win + R → `services.msc`)
2. Procure por "postgresql"
3. Clique com botão direito → "Start"

---

## 📚 Recursos Adicionais

- **Node.js Docs**: https://nodejs.org/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **News API**: https://newsapi.org/ (para obter um token de API)

---

## ✅ Checklist de Instalação

- [ ] Node.js instalado e funcionando (`node --version`)
- [ ] PostgreSQL instalado e funcionando
- [ ] Banco de dados `news_db` criado
- [ ] Arquivo `.env` configurado com senha correta
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] API respondendo em http://localhost:3000

---

## 🎉 Próximos Passos

1. Obter um token da News API em: https://newsapi.org/
2. Adicionar o token no perfil do usuário após registro
3. Começar a desenvolver o frontend ou testar a API com Postman/Insomnia

---

**Dúvidas?** Verifique os logs do servidor para mensagens de erro mais detalhadas.
