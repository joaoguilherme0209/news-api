import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** Categorias da News API (parâmetro category). Apenas estas são aceitas como favoriteTopics. */
const ALLOWED_FAVORITE_TOPICS = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology'
];

function normalizeFavoriteTopics(topics) {
  if (!Array.isArray(topics)) return [];
  return topics.filter((t) => typeof t === 'string' && ALLOWED_FAVORITE_TOPICS.includes(t.trim()));
}

// Gerar token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Registrar novo usuário
export const registerUser = async (userData) => {
  const { email, password, newsApiToken, favoriteTopics, emailFrequency } = userData;

  // Verificar se o email já existe
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Criar novo usuário
  const user = await User.create({
    email,
    password,
    newsApiToken: newsApiToken || null,
    favoriteTopics: normalizeFavoriteTopics(favoriteTopics),
    emailFrequency: emailFrequency || 'never'
  });

  // Gerar token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      favoriteTopics: user.favoriteTopics,
      emailFrequency: user.emailFrequency
    },
    token
  };
};

// Login
export const loginUser = async (email, password) => {
  // Buscar usuário
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  // Verificar senha
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Email ou senha inválidos');
  }

  // Gerar token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      favoriteTopics: user.favoriteTopics,
      emailFrequency: user.emailFrequency,
      hasNewsApiToken: !!user.newsApiToken
    },
    token
  };
};

// Obter perfil do usuário
export const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return {
    id: user.id,
    email: user.email,
    favoriteTopics: user.favoriteTopics,
    emailFrequency: user.emailFrequency,
    hasNewsApiToken: !!user.newsApiToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

// Atualizar perfil do usuário
export const updateUserProfile = async (userId, updateData) => {
  const { newsApiToken, favoriteTopics, emailFrequency } = updateData;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (newsApiToken !== undefined) user.newsApiToken = newsApiToken;
  if (favoriteTopics !== undefined) user.favoriteTopics = normalizeFavoriteTopics(favoriteTopics);
  if (emailFrequency !== undefined) {
    if (['daily', 'weekly', 'never'].includes(emailFrequency)) {
      user.emailFrequency = emailFrequency;
    } else {
      throw new Error('Frequência de email inválida. Use: daily, weekly ou never');
    }
  }

  await user.save();

  return {
    id: user.id,
    email: user.email,
    favoriteTopics: user.favoriteTopics,
    emailFrequency: user.emailFrequency,
    hasNewsApiToken: !!user.newsApiToken
  };
};
