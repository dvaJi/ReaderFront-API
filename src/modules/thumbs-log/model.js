'use strict';

// Operation
module.exports = function(sequelize, DataTypes) {
  let ThumbsLog = sequelize.define('thumbs_log', {
    filename: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.STRING
    },
    workDir: {
      type: DataTypes.STRING
    },
    chapterDir: {
      type: DataTypes.STRING
    }
  });

  return ThumbsLog;
};
