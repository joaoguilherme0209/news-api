'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      newsApiToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      favoriteTopics: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      emailFrequency: {
        type: Sequelize.ENUM('daily', 'weekly', 'never'),
        allowNull: false,
        defaultValue: 'never'
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_emailFrequency";');
  }
};
