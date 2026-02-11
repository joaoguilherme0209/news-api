import Collection from '../models/Collection.js';
import Article from '../models/Article.js';

// Criar nova coleção
export const createCollection = async (userId, name) => {
  const collection = await Collection.create({
    name: name.trim(),
    userId
  });

  return collection;
};

// Listar todas as coleções do usuário
export const getUserCollections = async (userId) => {
  const collections = await Collection.findAll({
    where: { userId },
    include: [{
      model: Article,
      as: 'articles',
      attributes: ['id', 'title', 'url', 'urlToImage', 'publishedAt']
    }],
    order: [['createdAt', 'DESC']]
  });

  return collections;
};

// Obter uma coleção específica com seus artigos
export const getCollectionById = async (collectionId, userId) => {
  const collection = await Collection.findOne({
    where: {
      id: collectionId,
      userId
    },
    include: [{
      model: Article,
      as: 'articles',
      order: [['publishedAt', 'DESC']]
    }]
  });

  if (!collection) {
    throw new Error('Coleção não encontrada');
  }

  return collection;
};

// Atualizar nome da coleção
export const updateCollection = async (collectionId, userId, name) => {
  const collection = await Collection.findOne({
    where: {
      id: collectionId,
      userId
    }
  });

  if (!collection) {
    throw new Error('Coleção não encontrada');
  }

  collection.name = name.trim();
  await collection.save();

  return collection;
};

// Deletar coleção
export const deleteCollection = async (collectionId, userId) => {
  const collection = await Collection.findOne({
    where: {
      id: collectionId,
      userId
    }
  });

  if (!collection) {
    throw new Error('Coleção não encontrada');
  }

  await collection.destroy();
  return true;
};

// Adicionar artigo à coleção
export const addArticleToCollection = async (collectionId, userId, articleData) => {
  const { title, description, url, urlToImage, publishedAt, source, author } = articleData;

  // Verificar se a coleção existe e pertence ao usuário
  const collection = await Collection.findOne({
    where: {
      id: collectionId,
      userId
    }
  });

  if (!collection) {
    throw new Error('Coleção não encontrada');
  }

  // Verificar se o artigo já existe na coleção
  const existingArticle = await Article.findOne({
    where: {
      url,
      collectionId: collection.id
    }
  });

  if (existingArticle) {
    throw new Error('Artigo já existe nesta coleção');
  }

  const article = await Article.create({
    title: title.trim(),
    description: description || null,
    url,
    urlToImage: urlToImage || null,
    publishedAt: new Date(publishedAt),
    source: source || null,
    author: author || null,
    collectionId: collection.id
  });

  return article;
};

// Remover artigo da coleção
export const removeArticleFromCollection = async (collectionId, articleId, userId) => {
  // Verificar se a coleção existe e pertence ao usuário
  const collection = await Collection.findOne({
    where: {
      id: collectionId,
      userId
    }
  });

  if (!collection) {
    throw new Error('Coleção não encontrada');
  }

  const article = await Article.findOne({
    where: {
      id: articleId,
      collectionId: collection.id
    }
  });

  if (!article) {
    throw new Error('Artigo não encontrado nesta coleção');
  }

  await article.destroy();
  return true;
};
