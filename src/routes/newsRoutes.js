import express from 'express';
import { searchNews, getAllNews, getFavoriteTopicsNews } from '../controllers/newsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas de notícias requerem autenticação
router.use(authMiddleware);

// Buscar notícias por tópico
router.get('/search', searchNews);

// Todas as notícias (top-headlines, sem filtro)
router.get('/all', getAllNews);

// Buscar notícias dos tópicos favoritos
router.get('/favorites', getFavoriteTopicsNews);

export default router;
