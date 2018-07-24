'use strict';

// Preference
module.exports = function(sequelize, DataTypes) {
  let Preference = sequelize.define('preferences', {
    name: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.STRING
    },
    group: {
      type: DataTypes.STRING
    }
  });

  return Preference;
};
