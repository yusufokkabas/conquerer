const Response = require("../utils/response");
const APIError = require("../utils/errors");
const db = require('../../models');
const post = db.Post;
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const savePost = async (req, res) => {  
  try {
    const { title, content, category_id,user_id } = req.body;
    const postInfo = {
      title: title,
      content: content,
      category_id: category_id,
      user_id: user_id
    };
    const result = await post.create(postInfo)
    const response ={
      message: 'Post created successfully',
      title:result.title
    }
     return new Response(response).created(res);
  }
  catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  };
}

const getPost = async (req, res) => {
  try {
    const { queryBuilder } = req;
    const { type }= req.query;
    let options = {};
    if(type === 'detail'){
      options = {
        where: queryBuilder.filters,
        attributes: ['id','title', 'content', 'updatedAt','createdAt'],
        include: [ //include comments, user and category(left outer join). detail type
          { model: db.Comment, as: 'Comments',attributes:['createdAt','comment'] ,include: [
            {
            model: db.User,
            as: 'User',
            attributes:['full_name']
          },
        ]        
          },
          { model: db.User, as: 'User', attributes:['full_name']},
          { model: db.Category, as: 'Category', attributes:['name']}
        ],
        order: [['updatedAt', 'DESC']] //order by updated date
      }
    }
    else if(type === 'list'){
      options = {
        where : queryBuilder.filters,
        attributes: ['id','title', [Sequelize.fn('COUNT', Sequelize.col('Comments.id')), 'comment_count']],
        include: [ //include user, category and comments count(left outer join). list type
          { 
            model: db.User, 
            as: 'User', 
            attributes: ['username']
          },
          { 
            model: db.Category, 
            as: 'Category', 
            attributes: ['name']
          },
          { 
            model: db.Comment, 
            as: 'Comments', 
            attributes: []
          }
        ],
        group: ['Post.id', 'User.id', 'Category.id'],
        raw: true,
        order: [['updatedAt', 'DESC']] //order by updated date
      }
    }
    else{
      throw new APIError('Invalid type! Please select list or detail', 400);
    }
    const postInfo = await post.findAll(options);
    return new Response(postInfo).success(res); 
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }
};

const updatePost = async (req, res) => {  
    try {
        const { queryBuilder } = req;
        const { title, content } = req.body;
        const postInfo = await post.findOne({where: queryBuilder.filters}); //post control
    
        if (!postInfo) {
          throw new APIError('Post not found', 404);
        }
        if(title) postInfo.title = title;
        if(content) postInfo.content = content;
        await postInfo.save();
        const response ={
          message: 'Post updated successfully',
          title:postInfo.title
        }
        return new Response(response).success(res);
      } catch (error) {
        console.error(error);
        throw new APIError(error, 400);
      }
  }

const deletePost = async (req, res) => {  
  try {
    const { queryBuilder } = req;
    const postInfo = await post.findOne({where: queryBuilder.filters}); //post control
    if (!postInfo) {
      throw new APIError('Post not found', 404);
    }
    await postInfo.destroy();
    const response ={
      message: 'Post deleted successfully',
      title:postInfo.title
    }
    return new Response(response).success(res);
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }
}


module.exports = {
  savePost,
  getPost,
  updatePost,
  deletePost
};