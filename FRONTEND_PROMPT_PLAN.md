# Prompt para Modo Plan - Frontend React

Use este documento como prompt completo para criar o frontend React do projeto News API. Copie todo o conteúdo abaixo e envie para o modo Plan.

---

## CONTEXTO DO PROJETO

Este é um **web app production-ready** para um desafio técnico. O backend já está implementado em **Node.js + Express + PostgreSQL** e funcionando. Preciso que você crie o **frontend em React** que consuma essa API.

### Requisitos do Desafio
1. **Onboarding:** usuário autentica, define tópicos favoritos e frequência de envio de email
2. **Buscar notícias** por tópico
3. **Exibir resultados** em formato amigável
4. **Ver detalhes** de um artigo
5. **Salvar artigos** em coleções personalizadas (criar/editar nome)
6. **Visualizar artigos salvos** por coleção
7. **Remover artigos** das coleções
8. **Feature extra:** enviar por e-mail resumo das notícias dos tópicos favoritos (frequência definida pelo usuário)
9. **Código production-ready**
10. **App deployável**

---

## BACKEND - INFORMAÇÕES DA API

**Base URL:** `http://localhost:3000` (ou variável de ambiente para produção)

**Autenticação:** Todas as rotas protegidas usam header `Authorization: Bearer {token}`

### Padrão de Resposta da API
```json
{
  "success": true,
  "message": "Mensagem opcional",
  "data": { ... }
}
```
Em caso de erro: `success: false`, `message` com descrição, `errors` (array) quando houver validação.

---

### ENDPOINTS DETALHADOS

#### 1. Autenticação (públicas)

**POST /api/auth/register**
- Body: `{ email, password, favoriteTopics?, emailFrequency? }`
- favoriteTopics: array de strings ["crypto", "AI", "NFT"]
- emailFrequency: "daily" | "weekly" | "never"
- Resposta: `{ data: { user: {...}, token: "jwt..." } }`

**POST /api/auth/login**
- Body: `{ email, password }`
- Resposta: `{ data: { user: {...}, token: "jwt..." } }`

#### 2. Perfil (protegido)

**GET /api/auth/profile**
- Resposta: `{ data: { user: { id, email, favoriteTopics, emailFrequency, hasNewsApiToken, createdAt, updatedAt } } }`

**PUT /api/auth/profile**
- Body: `{ favoriteTopics?, emailFrequency? }`
- Resposta: `{ data: { user: {...} } }`

#### 3. Notícias (protegidas)

**GET /api/news/search?topic={topic}&page=1&pageSize=20**
- Query: topic (obrigatório), page, pageSize
- Resposta: `{ data: { articles: [...], totalResults, page, pageSize } }`
- Estrutura de article: `{ title, description, url, urlToImage, publishedAt, source, author }`

**GET /api/news/favorites**
- Resposta: `{ data: { topics: [{ topic: "crypto", articles: [...] }, ...] } }`
- Requer favoriteTopics configurado no perfil

#### 4. Coleções (protegidas)

**POST /api/collections**
- Body: `{ name: "Nome da coleção" }`
- Resposta: `{ data: { collection: { id, name, userId, createdAt, updatedAt } } }`

**GET /api/collections**
- Resposta: `{ data: { collections: [{ id, name, articles: [...] }, ...] } }`

**GET /api/collections/:id**
- Resposta: `{ data: { collection: { id, name, articles: [...] } } }`

**PUT /api/collections/:id**
- Body: `{ name: "Novo nome" }`

**DELETE /api/collections/:id**

#### 5. Artigos em Coleções (protegidas)

**POST /api/collections/:id/articles**
- Body: `{ title, url, publishedAt, description?, urlToImage?, source?, author? }`
- Resposta: `{ data: { article: { id, title, description, url, urlToImage, publishedAt, source, author, collectionId } } }`

**DELETE /api/collections/:collectionId/articles/:articleId**

---

## STACK TÉCNICA DO FRONTEND

- **React** (Vite ou Create React App)
- **React Router** para navegação
- **Estado:** Context API ou Zustand para auth + dados globais
- **Requisições:** Axios ou fetch com interceptors para JWT
- **Estilização:** Tailwind CSS, ou CSS Modules, ou styled-components
- **Formulários:** validação com react-hook-form + zod/yup (opcional)

---

## FLUXO E TELAS OBRIGATÓRIAS

### 1. Onboarding / Auth
- Tela de Login
- Tela de Registro (com campos: email, senha, tópicos favoritos, frequência de email)
- Proteção de rotas: redirecionar para login se não autenticado

### 2. Busca de Notícias
- Campo de busca por tópico
- Lista de artigos em cards (imagem, título, fonte, data)
- Paginação
- Botão "Salvar" em cada artigo → abre modal para escolher coleção (ou criar nova)

### 3. Detalhes do Artigo
- Tela/modal com título, descrição, imagem, link externo, autor, fonte, data
- Opção de salvar na coleção

### 4. Coleções
- Lista de coleções do usuário
- Criar nova coleção (modal ou inline)
- Editar nome da coleção
- Deletar coleção
- Ver artigos de cada coleção
- Remover artigo da coleção

### 5. Perfil / Configurações
- Ver e editar tópicos favoritos
- Editar frequência de email (daily, weekly, never)
- Logout

### 6. Layout Geral
- Header com navegação: Buscar | Minhas Coleções | Perfil | Logout
- Sidebar ou menu responsivo em mobile

---

## PONTOS IMPORTANTES

1. **Persistência do token:** armazenar JWT no localStorage (ou cookie httpOnly se houver backend para isso); incluir em todas as requisições protegidas
2. **Tratamento de 401:** redirecionar para login quando token expirar
3. **Feedback ao usuário:** loading states, mensagens de sucesso/erro (toast ou alert)
4. **Responsividade:** layout mobile-first
5. **Acessibilidade:** labels em inputs, contraste adequado
6. **Feature de email:** o backend pode ainda não ter implementado o envio de email; no frontend, exiba o campo de frequência no perfil e, se o backend tiver o endpoint, integre. Caso contrário, apenas a UI de configuração já atende.
7. **API base URL:** usar variável de ambiente (ex: VITE_API_URL) para facilitar deploy

---

## ESTRUTURA SUGERIDA DO PROJETO REACT

```
src/
├── api/           # Cliente HTTP, interceptors, funções de chamada
├── components/    # Componentes reutilizáveis
├── contexts/      # AuthContext, etc.
├── hooks/         # useAuth, useCollections, etc.
├── pages/         # Login, Register, Search, Collections, Profile, etc.
├── routes/        # Configuração do React Router
├── utils/         # Helpers, formatação de data
└── App.jsx
```

---

## CRITÉRIOS DE AVALIAÇÃO (do desafio)

- Experiência do usuário
- Qualidade do código
- Estrutura do projeto
- Funcionalidade
- Criatividade

---

## RESUMO DO QUE PRECISO

Crie um frontend React completo que:
1. Faça login/registro e gerencie o token JWT
2. Permita buscar notícias por tópico e exibir em cards
3. Permita ver detalhes de cada artigo
4. Permita criar coleções e salvar artigos nelas
5. Permita visualizar, editar e remover artigos das coleções
6. Tenha tela de perfil para configurar tópicos favoritos e frequência de email
7. Seja responsivo e tenha boa UX
8. Seja production-ready e deployável (ex: Vercel, Netlify)

O backend está em `news-api/` e roda em `http://localhost:3000`. O frontend deve ser criado em pasta separada (ex: `news-app/` ou `frontend/`) no mesmo workspace.
