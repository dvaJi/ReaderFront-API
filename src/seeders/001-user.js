'use strict';

const bcrypt = require('bcrypt');
const config = require('../config/server.json');
const params = require('../config/params.json');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('users', [
      {
        name: 'The Admin',
        email: 'admin@weeabo.com',
        password: bcrypt.hashSync('123456', config.saltRounds),
        role: params.user.roles.admin,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'The User',
        email: 'user@otaku.uwu',
        password: bcrypt.hashSync('123456', config.saltRounds),
        role: params.user.roles.user,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
