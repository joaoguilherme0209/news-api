'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      urlToImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true
      },
      collectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'collections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('articles', ['collectionId']);
    await queryInterface.addIndex('articles', ['url', 'collectionId'], {
      unique: true,
      name: 'unique_article_per_collection'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('articles');
  }
};
