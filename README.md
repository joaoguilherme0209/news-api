# News API Backend

Backend production-ready para desafio técnico - Sistema de busca e gerenciamento de notícias.

## 🚀 Tecnologias

- **Node.js** (ES Modules)
- **Express.js** - Framework web
- **Sequelize ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Axios** - Cliente HTTP para News API

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (v12 ou superior)
- Conta na [News API](https://newsapi.org/) para obter um token

## 🔧 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=news_db
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=seu-secret-jwt-super-seguro
JWT_EXPIRES_IN=7d

NEWS_API_KEY=sua-chave-da-newsapi-org
```

3. **Criar banco de dados PostgreSQL:**
```sql
CREATE DATABASE news_db;
```

4. **Iniciar o servidor:**
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

## 📚 Estrutura do Projeto

```
news-api/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do Sequelize
│   ├── models/
│   │   ├── User.js              # Modelo de usuário
│   │   ├── Collection.js       # Modelo de coleção
│   │   ├── Article.js          # Modelo de artigo
│   │   └── index.js            # Exportação dos modelos
│   ├── controllers/
│   │   ├── authController.js   # Controllers de autenticação
│   │   └── newsController.js   # Controllers de notícias
│   ├── middlewares/
│   │   └── authMiddleware.js   # Middleware de autenticação JWT
│   └── routes/
│       ├── authRoutes.js       # Rotas de autenticação
│       ├── newsRoutes.js       # Rotas de notícias
│       └── collectionRoutes.js # Rotas de coleções
├── server.js                    # Arquivo principal
├── package.json
└── .env.example
```

## 🔐 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil (protegido)
- `PUT /api/auth/profile` - Atualizar perfil (protegido)

### Notícias

- `GET /api/news/search?topic=crypto&page=1&pageSize=20` - Buscar notícias por tópico (protegido)
- `GET /api/news/favorites` - Buscar notícias dos tópicos favoritos (protegido)

### Coleções

- `POST /api/collections` - Criar coleção (protegido)
- `GET /api/collections` - Listar coleções do usuário (protegido)
- `GET /api/collections/:id` - Obter coleção específica (protegido)
- `PUT /api/collections/:id` - Atualizar nome da coleção (protegido)
- `DELETE /api/collections/:id` - Deletar coleção (protegido)
- `POST /api/collections/:id/articles` - Adicionar artigo à coleção (protegido)
- `DELETE /api/collections/:collectionId/articles/:articleId` - Remover artigo (protegido)

## 📝 Exemplos de Uso

### Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123",
    "newsApiToken": "seu-token-news-api",
    "favoriteTopics": ["crypto", "AI"],
    "emailFrequency": "daily"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123"
  }'
```

### Buscar Notícias (com token JWT)
```bash
curl -X GET "http://localhost:3000/api/news/search?topic=crypto&page=1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 🗄️ Modelos de Dados

### User
- `id` - ID único
- `email` - Email (único)
- `password` - Senha (hash)
- `newsApiToken` - Token da News API
- `favoriteTopics` - Array de tópicos favoritos (JSON)
- `emailFrequency` - Frequência de email ('daily', 'weekly', 'never')

### Collection
- `id` - ID único
- `name` - Nome da coleção
- `userId` - ID do usuário (FK)

### Article
- `id` - ID único
- `title` - Título
- `description` - Descrição
- `url` - URL do artigo
- `urlToImage` - URL da imagem
- `publishedAt` - Data de publicação
- `source` - Fonte
- `author` - Autor
- `collectionId` - ID da coleção (FK)

## 🔒 Segurança

- Senhas são hasheadas com bcrypt antes de serem salvas
- Tokens JWT são usados para autenticação
- Middleware de autenticação protege rotas sensíveis
- Validação de dados com express-validator

## 📦 Próximos Passos

- [ ] Implementar sistema de envio de emails (resumo de notícias)
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar migrations do Sequelize
- [ ] Adicionar rate limiting
- [ ] Implementar cache para requisições à News API
- [ ] Adicionar documentação Swagger/OpenAPI

## 📄 Licença

ISC
