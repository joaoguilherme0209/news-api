import User from '../models/User.js';
import * as newsService from './newsService.js';
import { sendFavoritesDigestEmail } from './emailService.js';

function getCutoffDate(frequency) {
  const now = new Date();
  const cutoff = new Date(now);

  if (frequency === 'daily') {
    cutoff.setDate(cutoff.getDate() - 1);
  } else if (frequency === 'weekly') {
    cutoff.setDate(cutoff.getDate() - 7);
  } else {
    return null;
  }

  return cutoff;
}

export async function runDigestForFrequency(frequency) {
  if (!['daily', 'weekly'].includes(frequency)) {
    throw new Error('Frequência inválida. Use: daily ou weekly');
  }

  const cutoff = getCutoffDate(frequency);

  // Busca usuários com essa frequência e que não desativaram (never já é filtrado)
  const users = await User.findAll({
    where: {
      emailFrequency: frequency
    }
  });

  let sentCount = 0;
  const errors = [];

  for (const user of users) {
    try {
      // Se tiver lastDigestSentAt recente, pula
      if (user.lastDigestSentAt && cutoff && user.lastDigestSentAt > cutoff) {
        continue;
      }

      const favoriteTopics = Array.isArray(user.favoriteTopics) ? user.favoriteTopics : [];
      if (!favoriteTopics.length) {
        continue;
      }

      const { articles } = await newsService.getFavoriteTopicsNews(favoriteTopics, 1, 5);

      if (!articles || articles.length === 0) {
        continue;
      }

      await sendFavoritesDigestEmail(user, articles);

      user.lastDigestSentAt = new Date();
      await user.save();

      sentCount += 1;
    } catch (err) {
      errors.push({
        userId: user.id,
        email: user.email,
        error: err.message
      });
    }
  }

  return {
    frequency,
    totalUsers: users.length,
    sentCount,
    errors
  };
}

