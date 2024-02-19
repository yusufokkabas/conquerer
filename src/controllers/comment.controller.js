const Response = require("../utils/response");
const APIError = require("../utils/errors");
const db = require('../../models');
const comment = db.Comment;
const { Op } = require('sequelize');
const saveComment = async (req, res) => {  
  try {
    const { user_id,post_id,comment } = req.body;
    const commentInfo = {
      user_id: user_id,
      post_id: post_id,
      comment: comment
    };
    const result = await db.Comment.create(commentInfo)
    const response ={
      message: 'Comment created successfully',
      comment:result.comment
    }
     return new Response(response).created(res);
  }
  catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  };
}

const getComments = async (req, res) => {
  try {
    const { queryBuilder } = req;
    const commentInfo = await comment.findAll({
      where: queryBuilder.filters,
      attributes:['id','comment','createdAt'],
      order: [['createdAt', 'DESC']], //order by created date
      include: [ //include user and post(left outer join)
        {
          model: db.User,
          as: 'User',
          attributes:['full_name']
        },
        {
          model: db.Post,
          as: 'Post',
          attributes:['title']
        }
      ]
    });
    return new Response(commentInfo).success(res); 
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }
};

const deleteComment = async (req, res) => {  
  try {
    const { queryBuilder } = req;
    const commentInfo = await comment.findOne({where: queryBuilder.filters}); //comment control
    if (!commentInfo) {
      throw new APIError('Comment not found', 404);
    }
    await commentInfo.destroy();
    const response ={
      message: 'Comment deleted successfully',
      comment:commentInfo.comment
    }
    return new Response(response).success(res);
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }
}


module.exports = {
  saveComment,
  getComments,
  deleteComment
};