const Response = require("../utils/response");
const APIError = require("../utils/errors");
const db = require('../../models');
const category = db.Category;
const { Op } = require('sequelize');
const saveCategory = async (req, res) => {  
  try {
    const { name } = req.body;
    const categoryInfo = {
      name: name
    };
    const result = await category.create(categoryInfo)
     return new Response(result).created(res); 
  }
  catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  };
}

const getCategory = async (req, res) => {
  try {
    const { queryBuilder } = req;
    const categoryInfo = await category.findAll({where: queryBuilder.filters, attributes:['id', 'name']});
    return new Response(categoryInfo).success(res); 
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }
};


module.exports = {
  saveCategory,
  getCategory
};