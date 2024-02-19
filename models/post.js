'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.belongsTo(models.Category, { foreignKey: 'category_id' });
      this.hasMany(models.Comment, { foreignKey: 'post_id' });
    }
  }
  Post.init({
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
    paranoid: true,
    hooks: {
      beforeDestroy: async (post, options) => {
        //hooks for deleting post's comments
        await sequelize.models.Comment.destroy({ where: { post_id: post.id }, individualHooks: true });
      }
    }
  });
  return Post;
};