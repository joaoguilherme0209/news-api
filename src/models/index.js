import User from './User.js';
import Collection from './Collection.js';
import Article from './Article.js';

// Exportar todos os modelos
export { User, Collection, Article };

// Função para sincronizar todos os modelos
export const syncModels = async (force = false) => {
  try {
    await User.sync({ force });
    await Collection.sync({ force });
    await Article.sync({ force });
    console.log('✅ Modelos sincronizados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar modelos:', error);
    throw error;
  }
};
