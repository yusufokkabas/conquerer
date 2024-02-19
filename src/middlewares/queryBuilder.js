const { Op } = require('sequelize');
const createQuery = async (req, res, next) => {
    try {
      let { query } = req;
      let { filters } = query;
      if(filters){  //querBuilder
        const filterArray = filters.split(',');
        filters={};
        filterArray.forEach((field) => {
          if (field.includes(':')) {
            const fieldArray = field.split(':');
            if (fieldArray.length > 3) {
              throw new APIError('Invalid field', 400);
            }
            if(fieldArray.length === 2){
                if(fieldArray[0].includes('.')){
                    filters["$"+fieldArray[0]+"$"] = fieldArray[1];
                }
                else{
                    filters[fieldArray[0]] = fieldArray[1];
                }   
            }
            if(fieldArray.length === 3){
              let field = "";
              if(fieldArray[0].includes('.')){
                field = "$"+fieldArray[0]+"$";
              }
              else{
                field = fieldArray[0];
              } 
              if(fieldArray[1] === 'gt'){
                if(field in filters){
                  filters[field][Op.gt] = fieldArray[2];
                }
                else{
                  filters[field] = {};
                  filters[field][Op.gt] = fieldArray[2];
                }
              }
              if(fieldArray[1] === 'lt'){
                if(field in filters){
                  filters[field][Op.lt] = fieldArray[2];
                }
                else{
                  filters[field] = {};
                  filters[field][Op.lt] = fieldArray[2];
                }
              }
              if(fieldArray[1] === 'gte'){
                if(field in filters){
                  filters[field][Op.gte] = fieldArray[2];
                }
                else{
                  filters[field] = {};
                  filters[field][Op.gte] = fieldArray[2];
                }
              }
              if(fieldArray[1] === 'lte'){
                if(field in filters){
                  filters[field][Op.lte] = fieldArray[2];
                }
                else{
                  filters[field] = {};
                  filters[field][Op.lte] = fieldArray[2];
                }
              }
              if(fieldArray[1] === 'eq'){
                if(field in filters){
                  filters[field][Op.eq] = fieldArray[2];
                }
                else{
                  filters[field] = {};
                  filters[field][Op.eq] = fieldArray[2];
                }
              }
              if(fieldArray[1] === 'like'){
                if(field in filters){
                    filters[field][Op.like] = `%${fieldArray[2]}%`;
                }
                else{
                    filters[field] = {};
                    filters[field][Op.like] = `%${fieldArray[2]}%`;
                }
            }

            }
          }
          else{
            throw new APIError('Invalid syntax for fields', 400);
        }
        });
      }
      const queryBuilder = {
        filters: filters || {},
      };
      req.queryBuilder = queryBuilder;
      next();
    } catch (error) {
      console.error(error);
      throw new APIError(error, 400);
    }
  };

  module.exports = createQuery;