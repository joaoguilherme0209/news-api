import * as newsService from '../services/newsService.js';

// Buscar notícias por tópico usando a News API
export const searchNews = async (req, res) => {
  try {
    const { topic, page = 1, pageSize = 20 } = req.query;

    const result = await newsService.searchNewsByTopic(topic, page, pageSize);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);

    const statusCode = error.statusCode || 
                      (error.message.includes('NEWS_API_KEY') ? 500 : 
                       error.message.includes('inválido') ? 401 : 500);

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao buscar notícias',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Todas as notícias (top-headlines, sem filtro de favoritos)
export const getAllNews = async (req, res) => {
  try {
    const { page = 1, pageSize = 9 } = req.query;

    const result = await newsService.getAllNews(page, pageSize);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);

    const statusCode = error.message?.includes('Token') ? 401 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao buscar notícias',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Buscar notícias dos tópicos favoritos do usuário
export const getFavoriteTopicsNews = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, pageSize = 9 } = req.query;

    const result = await newsService.getFavoriteTopicsNews(
      user.favoriteTopics,
      page,
      pageSize
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erro ao buscar notícias dos tópicos favoritos:', error);

    const statusCode = error.message.includes('Token') || 
                      error.message.includes('tópico favorito') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao buscar notícias dos tópicos favoritos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
