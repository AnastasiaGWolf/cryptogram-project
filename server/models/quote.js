'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quote extends Model {
    static associate(models) {
      Quote.hasMany(models.QuoteTranslation, { foreignKey: 'quote_id' });
      Quote.hasMany(models.Result, { foreignKey: 'quote_id' });
    }
  }
  Quote.init({
    level: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    source: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Quote',
  });
  return Quote;
};