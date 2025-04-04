'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.addColumn('food', 'quantity', {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
   })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('food', 'quantity');
  }

};
