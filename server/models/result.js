'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    static associate(models) {
      Result.belongsTo(models.User, { foreignKey: 'user_id' });
      Result.belongsTo(models.Quote, { foreignKey: 'quote_id' });
    }
  }
  Result.init({
    user_id: DataTypes.INTEGER,
    quote_id: DataTypes.INTEGER,
    completed: DataTypes.BOOLEAN,
    attempts: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    completionTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};