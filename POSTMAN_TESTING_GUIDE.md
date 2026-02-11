# 🧪 Roteiro de Testes - Postman

Guia completo para testar todas as funcionalidades da API News usando Postman.

**Base URL:** `http://localhost:3000`

---

## 📋 Índice

1. [Health Check](#1-health-check)
2. [Autenticação](#2-autenticação)
3. [Perfil do Usuário](#3-perfil-do-usuário)
4. [Notícias](#4-notícias)
5. [Coleções](#5-coleções)
6. [Artigos em Coleções](#6-artigos-em-coleções)

---

## 1. Health Check

### 1.1 - Verificar se a API está online

| Campo | Valor |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:3000` |
| **Headers** | Nenhum |
| **Body** | Nenhum |

**Resposta esperada:** Status 200, mensagem de boas-vindas

---

### 1.2 - Health check

| Campo | Valor |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/health` |
| **Headers** | Nenhum |
| **Body** | Nenhum |

**Resposta esperada:** Status 200, `{ "success": true, "status": "healthy" }`

---

## 2. Autenticação

### 2.1 - Registrar novo usuário

| Campo | Valor |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:3000/api/auth/register` |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | Ver abaixo |

```json
{
  "email": "teste@example.com",
  "password": "senha123",
  "newsApiToken": "SEU_TOKEN_DA_NEWS_API",
  "favoriteTopics": ["crypto", "AI", "NFT"],
  "emailFrequency": "daily"
}
```

**Campos opcionais:** `newsApiToken`, `favoriteTopics`, `emailFrequency`  
**Resposta esperada:** Status 201, `user` e `token` no body

> ⚠️ **IMPORTANTE:** Guarde o `token` retornado! Você vai precisar dele nas próximas requisições.

---

### 2.2 - Fazer login

| Campo | Valor |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:3000/api/auth/login` |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | |

```json
{
  "email": "teste@example.com",
  "password": "senha123"
}
```

**Resposta esperada:** Status 200, `user` e `token` no body

> ⚠️ Guarde o `token` para usar como Bearer Token nas rotas protegidas.

---

### 2.3 - Login com credenciais inválidas (teste de erro)

| Campo | Valor |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:3000/api/auth/login` |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | |

```json
{
  "email": "email@invalido.com",
  "password": "senhaerrada"
}
```

**Resposta esperada:** Status 401, mensagem "Email ou senha inválidos"

---

## 3. Perfil do Usuário

> 🔒 **Rotas protegidas:** Adicione o header `Authorization: Bearer SEU_TOKEN`

### 3.1 - Obter perfil do usuário logado

| Campo | Valor |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/auth/profile` |
| **Headers** | `Authorization: Bearer SEU_TOKEN` |

**Resposta esperada:** Status 200, dados do usuário

---

### 3.2 - Atualizar perfil (tópicos favoritos, frequência de email)

| Campo | Valor |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `http://localhost:3000/api/auth/profile` |
| **Headers** | `Authorization: Bearer SEU_TOKEN`<br>`Content-Type: application/json` |
| **Body (raw JSON)** | |

```json
{
  "favoriteTopics": ["crypto", "NFT", "AI", "blockchain"],
  "emailFrequency": "weekly"
}
```

**emailFrequency:** `"daily"` | `"weekly"` | `"never"`  
**Resposta esperada:** Status 200, perfil atualizado

---

## 4. Notícias

> 🔒 **Todas as rotas requerem:** `Authorization: Bearer SEU_TOKEN`  
> 📌 **Configuração:** A chave da News API deve estar no arquivo `.env` como `NEWS_API_KEY` (global para todos os usuários)

### 4.1 - Buscar notícias por tópico

| Campo | Valor |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/news/search?topic=crypto&page=1&pageSize=10` |
| **Headers** | `Authorization: Bearer SEU_TOKEN` |

**Query Params:**
- `topic` (obrigatório): Ex: "crypto", "AI", "NFT"
- `page` (opcional): Página, default 1
- `pageSize` (opcional): Itens por página, default 20

**Resposta esperada:** Status 200, lista de artigos

---

### 4.2 - Buscar notícias dos tópicos favoritos

| Campo | Valor |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/news/favorites` |
| **Headers** | `Authorization: Bearer SEU_TOKEN` |

**Requisito:** Usuário deve ter `favoriteTopics` configurado no perfil  
**Resposta esperada:** Status 200, notícias agrupadas por tópico

---

## 5. Coleções

> 🔒 **Todas as rotas requerem:** `Authorization: Bearer SEU_TOKEN`

### 5.1 - Criar nova coleção

| Campo | Valor |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:3000/api/collections` |
| **Headers** | `Authorization: Bearer SEU_TOKEN`<br>`Content-Type: application/json` |
| **Body (raw JSON)** | |

```json
{
  "name": "Notícias de Crypto"
}
```

**Resposta esperada:** Status 201, coleção criada. Guarde o `id` da coleção.

---

### 5.2 - Listar todas as coleções do usuário

| Campo | Valor |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/collections` |
| **Headers** | `Authorization: Bearer SEU_TOKEN` |

**Resposta esperada:** Status 200, lista de coleções (com artigos se houver)

---

### 5.3 - Obter uma coleção específica (com artigos)

| Campo | Valor |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/collections/1` |
| **Headers** | `Authorization: Bearer SEU_TOKEN` |

Substitua `1` pelo ID da coleção  
**Resposta esperada:** Status 200, coleção com lista de artigos

---

### 5.4 - Atualizar nome da coleção

| Campo | Valor |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `http://localhost:3000/api/collections/1` |
| **Headers** | `Authorization: Bearer SEU_TOKEN`<br>`Content-Type: application/json` |
| **Body (raw JSON)** | |

```json
{
  "name": "Melhores notícias de Crypto"
}
```

**Resposta esperada:** Status 200, coleção atualizada

---

### 5.5 - Deletar coleção

| Campo | Valor |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `http://localhost:3000/api/collections/1` |
| **Headers** | `Authorization: Bearer SEU_TOKEN` |

**Resposta esperada:** Status 200, mensagem de sucesso

---

## 6. Artigos em Coleções

> 🔒 **Todas as rotas requerem:** `Authorization: Bearer SEU_TOKEN`

### 6.1 - Adicionar artigo à coleção

| Campo | Valor |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:3000/api/collections/1/articles` |
| **Headers** | `Authorization: Bearer SEU_TOKEN`<br>`Content-Type: application/json` |
| **Body (raw JSON)** | |

```json
{
  "title": "Bitcoin atinge novo recorde",
  "description": "Criptomoeda supera marca histórica...",
  "url": "https://example.com/noticia-bitcoin",
  "urlToImage": "https://example.com/imagem.jpg",
  "publishedAt": "2024-02-04T10:00:00.000Z",
  "source": "Example News",
  "author": "João Silva"
}
```

**Campos obrigatórios:** `title`, `url`, `publishedAt`  
**Campos opcionais:** `description`, `urlToImage`, `source`, `author`  
**Resposta esperada:** Status 201, artigo criado. Guarde o `id` do artigo.

---

### 6.2 - Remover artigo da coleção

| Campo | Valor |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `http://localhost:3000/api/collections/1/articles/1` |
| **Headers** | `Authorization: Bearer SEU_TOKEN` |

- Primeiro `1` = ID da coleção
- Segundo `1` = ID do artigo

**Resposta esperada:** Status 200, mensagem de sucesso

---

## 📝 Ordem sugerida para testar

1. **Health Check** (1.1 e 1.2) → Confirmar que a API está rodando
2. **Registrar usuário** (2.1) → Obter o token
3. **Login** (2.2) → Obter novo token (ou usar o do registro)
4. **Obter perfil** (3.1) → Verificar dados
5. **Atualizar perfil** (3.2) → Configurar newsApiToken e tópicos favoritos
6. **Buscar notícias** (4.1) → Testar busca por tópico
7. **Notícias favoritas** (4.2) → Notícias dos tópicos favoritos
8. **Criar coleção** (5.1) → Criar "Notícias de Crypto"
9. **Listar coleções** (5.2) → Ver coleção criada
10. **Adicionar artigo** (6.1) → Adicionar um artigo da busca (4.1) à coleção
11. **Obter coleção** (5.3) → Ver coleção com artigos
12. **Atualizar coleção** (5.4) → Mudar nome
13. **Remover artigo** (6.2) → Remover artigo da coleção
14. **Deletar coleção** (5.5) → Remover coleção

---

## 🔧 Dica: Variável de ambiente no Postman

1. Crie um **Environment** no Postman
2. Adicione variável `baseUrl` = `http://localhost:3000`
3. Adicione variável `token` = (vazio inicialmente)
4. Após login/register, copie o token e cole na variável `token`
5. Use nas URLs: `{{baseUrl}}/api/auth/login`
6. No header Authorization: `Bearer {{token}}`

---

## ⚠️ Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Unauthorized | Token inválido ou expirado | Faça login novamente e use o novo token |
| 400 Bad Request | Dados inválidos | Verifique o body (email válido, senha min 6 chars, etc.) |
| 404 Not Found | Recurso não encontrado | Verifique se o ID da coleção/artigo existe |
| 500 NEWS_API_KEY | Chave não configurada | Adicione `NEWS_API_KEY` no arquivo `.env` |

---

## 📌 Chave da News API

A chave deve estar no arquivo `.env` como `NEWS_API_KEY=sua-chave`. Obtenha em: https://newsapi.org/
