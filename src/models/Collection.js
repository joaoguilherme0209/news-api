import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Collection = sequelize.define('Collection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'collections',
  timestamps: true
});

// Relacionamento: User (1) -> Collection (N)
User.hasMany(Collection, { foreignKey: 'userId', as: 'collections' });
Collection.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Collection;
