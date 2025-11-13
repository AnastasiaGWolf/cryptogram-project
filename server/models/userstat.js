'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStat extends Model {
    static associate(models) {
      UserStat.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  UserStat.init({
    user_id: DataTypes.INTEGER,
    totalScore: DataTypes.INTEGER,
    maxLevel: DataTypes.INTEGER,
    gamesPlayed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserStat',
  });
  return UserStat;
};