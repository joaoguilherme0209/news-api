import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { sendFavoritesDigestForCurrentUser, runDigestCron } from '../controllers/emailController.js';

const router = express.Router();

// Enviar resumo de notícias por e-mail para o usuário autenticado (teste manual)
router.post('/digest', authMiddleware, sendFavoritesDigestForCurrentUser);

// Endpoint para cron job (não usa auth de usuário, protegido por CRON_SECRET)
router.post('/run-digest', runDigestCron);

export default router;

