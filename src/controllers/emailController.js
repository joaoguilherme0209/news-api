import * as newsService from '../services/newsService.js';
import { sendFavoritesDigestEmail } from '../services/emailService.js';
import { runDigestForFrequency } from '../services/digestService.js';

// Envia um resumo de notícias baseado nos tópicos favoritos do usuário autenticado
export const sendFavoritesDigestForCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const frequency = user.emailFrequency || 'never';

    if (frequency === 'never') {
      return res.status(400).json({
        success: false,
        message: 'Usuário configurou para não receber e-mails (frequência "never")'
      });
    }

    const favoriteTopics = Array.isArray(user.favoriteTopics) ? user.favoriteTopics : [];

    if (!favoriteTopics.length) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não possui tópicos favoritos cadastrados'
      });
    }

    // Buscar algumas notícias dos tópicos favoritos do usuário
    const { articles } = await newsService.getFavoriteTopicsNews(favoriteTopics, 1, 5);

    if (!articles || articles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível encontrar notícias para os tópicos favoritos do usuário'
      });
    }

    const info = await sendFavoritesDigestEmail(user, articles);

    return res.status(200).json({
      success: true,
      message: 'Resumo de notícias enviado por e-mail com sucesso',
      data: {
        to: info.accepted,
        messageId: info.messageId,
        response: info.response,
        articlesCount: articles.length
      }
    });
  } catch (error) {
    console.error('Erro ao enviar resumo de notícias por e-mail:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao enviar resumo de notícias por e-mail'
    });
  }
};

// Endpoint interno para ser chamado por um cron (ex: Render Cron Job)
// Roda o digest para todos os usuários com a frequência indicada
export const runDigestCron = async (req, res) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const provided = req.headers['x-cron-secret'] || req.query.secret;

    if (cronSecret && cronSecret !== provided) {
      return res.status(403).json({
        success: false,
        message: 'Acesso não autorizado ao endpoint de cron'
      });
    }

    const frequency = req.body?.frequency || req.query.frequency || 'daily';

    const result = await runDigestForFrequency(frequency);

    return res.status(200).json({
      success: true,
      message: `Digest executado para frequência "${frequency}"`,
      data: result
    });
  } catch (error) {
    console.error('Erro ao executar digest via cron:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao executar digest via cron'
    });
  }
};

