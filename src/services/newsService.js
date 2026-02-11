import axios from 'axios';

// Formatar artigo da News API
const formatArticle = (article) => ({
  title: article.title,
  description: article.description,
  url: article.url,
  urlToImage: article.urlToImage,
  publishedAt: article.publishedAt,
  source: article.source?.name || 'Desconhecido',
  author: article.author || 'Desconhecido'
});

// Usa a chave global da News API (do .env) - mesma para todos os usuários
const getNewsApiKey = () => {
  const key = process.env.NEWS_API_KEY || process.env.NEWS_API_TOKEN;
  if (!key || key.trim() === '') {
    throw new Error('NEWS_API_KEY não configurada no arquivo .env');
  }
  return key;
};

// Utilitário para montar uma "janela" de resultados contínuos (offset) em cima
// da paginação da NewsAPI (que às vezes devolve menos itens que o pageSize).
const fetchNewsWindow = async ({ fetchPage, targetPage = 1, pageSize = 9 }) => {
  const size = Number.parseInt(pageSize, 10) || 9;
  const page = Number.parseInt(targetPage, 10) || 1;

  const startIndex = (page - 1) * size; // índice global inicial (0‑based)
  const endIndex = startIndex + size;   // índice global final (exclusivo)

  // Usamos um pageSize maior na NewsAPI para reduzir o número de chamadas.
  const apiPageSize = Math.min(size * 3, 100);

  let collected = [];
  let globalIndex = 0;
  let totalResults = 0;

  for (let apiPage = 1; globalIndex < endIndex; apiPage++) {
    const { articles, totalResults: apiTotal } = await fetchPage(apiPage, apiPageSize);
    if (apiTotal != null) {
      totalResults = apiTotal;
    }

    if (!articles || articles.length === 0) {
      break;
    }

    for (let i = 0; i < articles.length; i++) {
      if (globalIndex >= startIndex && collected.length < size) {
        collected.push(articles[i]);
      }
      globalIndex++;

      if (collected.length >= size || globalIndex >= endIndex) {
        break;
      }
    }

    // Se já coletamos o suficiente ou passamos do total, podemos parar.
    if (collected.length >= size || (totalResults && globalIndex >= totalResults)) {
      break;
    }
  }

  return {
    articles: collected,
    totalResults,
    page,
    pageSize: size
  };
};

// Buscar notícias por tópico usando a News API
export const searchNewsByTopic = async (topic, page = 1, pageSize = 20) => {
  const q = (topic || '').trim();
  if (!q) {
    throw new Error('Parâmetro "topic" é obrigatório');
  }

  const apiKey = getNewsApiKey();
  const newsApiUrl = 'https://newsapi.org/v2/everything';
  
  try {
    const response = await axios.get(newsApiUrl, {
      params: {
        q,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        sortBy: 'publishedAt',
        language: 'pt'
      },
      headers: {
        'X-Api-Key': apiKey
      }
    });

    // Formatar resposta
    const articles = response.data.articles.map(formatArticle);

    return {
      articles,
      totalResults: response.data.totalResults,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Erro ao buscar notícias';

      if (status === 401) {
        throw new Error('Token da News API inválido ou expirado');
      }

      const customError = new Error(message);
      customError.statusCode = status;
      throw customError;
    }

    throw new Error(`Erro ao buscar notícias: ${error.message}`);
  }
};

// Buscar top-headlines (ex.: quando usuário não tem favoritos)
export const getTopHeadlines = async (page = 1, pageSize = 9) => {
  try {
    const apiKey = getNewsApiKey();
    const url = 'https://newsapi.org/v2/top-headlines';

    const windowResult = await fetchNewsWindow({
      targetPage: page,
      pageSize,
      fetchPage: async (apiPage, apiPageSize) => {
        const response = await axios.get(url, {
          params: {
            country: 'br',
            page: apiPage,
            pageSize: apiPageSize
          },
          headers: {
            'X-Api-Key': apiKey
          }
        });

        return {
          articles: (response.data.articles || []).map(formatArticle),
          totalResults: response.data.totalResults
        };
      }
    });

    return {
      ...windowResult,
      fromFavorites: false
    };
  } catch (error) {
    console.error('Erro ao buscar top-headlines:', error);
    if (error.response?.status === 401) {
      throw new Error('Token da News API inválido ou expirado');
    }
    throw new Error(error.response?.data?.message || `Erro ao buscar notícias: ${error.message}`);
  }
};

/** Todas as notícias: usa /everything com query ampla (muito mais resultados que top-headlines) */
export const getAllNews = async (page = 1, pageSize = 9) => {
  try {
    const apiKey = getNewsApiKey();
    const url = 'https://newsapi.org/v2/everything';

    const windowResult = await fetchNewsWindow({
      targetPage: page,
      pageSize,
      fetchPage: async (apiPage, apiPageSize) => {
        const response = await axios.get(url, {
          params: {
            q: 'notícias',
            page: apiPage,
            pageSize: apiPageSize,
            sortBy: 'publishedAt',
            language: 'pt'
          },
          headers: {
            'X-Api-Key': apiKey
          }
        });

        return {
          articles: (response.data.articles || []).map(formatArticle),
          totalResults: response.data.totalResults
        };
      }
    });

    return {
      ...windowResult,
      fromFavorites: false
    };
  } catch (error) {
    console.error('Erro ao buscar todas as notícias:', error);
    if (error.response?.status === 401) {
      throw new Error('Token da News API inválido ou expirado');
    }
    throw new Error(error.response?.data?.message || `Erro ao buscar notícias: ${error.message}`);
  }
};

// Buscar notícias dos tópicos favoritos do usuário; sem favoritos retorna top-headlines
export const getFavoriteTopicsNews = async (favoriteTopics, page = 1, pageSize = 9) => {
  try {
    const apiKey = getNewsApiKey();
    const newsApiUrl = 'https://newsapi.org/v2/everything';

    // Normalizar tópicos (remover vazios, espaços, etc.)
    const safeTopics = (favoriteTopics || [])
      .map((t) => (t || '').trim())
      .filter((t) => t.length > 0);

    // Sem favoritos válidos: usa top-headlines com paginação
    if (safeTopics.length === 0) {
      return getTopHeadlines(page, pageSize);
    }

    // Com favoritos: busca em uma única query combinando os tópicos, focando em título/descrição
    const topicQuery = safeTopics.map((t) => `"${t}"`).join(' OR ');

    const windowResult = await fetchNewsWindow({
      targetPage: page,
      pageSize,
      fetchPage: async (apiPage, apiPageSize) => {
        const response = await axios.get(newsApiUrl, {
          params: {
            q: topicQuery,
            page: apiPage,
            pageSize: apiPageSize,
            sortBy: 'publishedAt',
            language: 'pt',
            searchIn: 'title,description'
          },
          headers: {
            'X-Api-Key': apiKey
          }
        });

        return {
          articles: (response.data.articles || []).map(formatArticle),
          totalResults: response.data.totalResults
        };
      }
    });

    return {
      ...windowResult,
      fromFavorites: true,
      favoriteTopics
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Token da News API inválido ou expirado');
    }
    throw new Error(error.response?.data?.message || `Erro ao buscar notícias: ${error.message}`);
  }
};
