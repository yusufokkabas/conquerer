'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Post, { foreignKey: 'user_id' });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    hooks: {
      beforeDestroy: async (user, options) => {
        //hooks for deleting user's posts and comments
        await sequelize.models.Post.destroy({ where: { user_id: user.id }, individualHooks: true });
        await sequelize.models.Comment.destroy({ where: { user_id: user.id }, individualHooks: true });
      }
    }
  });
  return User;
};