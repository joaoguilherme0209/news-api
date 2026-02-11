import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Collection from './Collection.js';

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  urlToImage: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true
  },
  collectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'collections',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'articles',
  timestamps: true,
  indexes: [
    {
      fields: ['collectionId']
    },
    {
      fields: ['url', 'collectionId'],
      unique: true,
      name: 'unique_article_per_collection'
    }
  ]
});

// Relacionamento: Collection (1) -> Article (N)
Collection.hasMany(Article, { foreignKey: 'collectionId', as: 'articles' });
Article.belongsTo(Collection, { foreignKey: 'collectionId', as: 'collection' });

export default Article;
