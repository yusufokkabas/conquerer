
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");
const db = require('../../models');

const login = async (req, res) => {
  try{
  const { email, password } = req.body;
  const userInfo = await db.User.findOne({where: {email:email}}); // email control
  if (userInfo==null) throw new APIError("Email is incorrect!", 401);
  const validatedUser = await bcrypt.compare(
    password,
    userInfo.password
  );
  if (!validatedUser) throw new APIError("Password is incorrect!", 401); //password control
  const token = await createToken(userInfo); //creating JWT token
  req.session.userId = userInfo.id;
  // Delete all other sessions of the same user
  const deleteResponse = await db.Session.destroy({
    where: {
      data: {
        [db.Sequelize.Op.like]: `%userId":${userInfo.id}%`
      },
      sid: {
        [db.Sequelize.Op.ne]: req.session.id
      }
    }
  });
  return new Response({"token":token,"username":userInfo.username}).success(res);
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  } 
};

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    const username = `${full_name.replace(/\s/g, '')}_${Date.now()}`; //creating unique username
    const emailCheck = await db.User.findOne({where: {email:email}});
    if (emailCheck) {
      throw new APIError("Mail is already on use!", 401);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //hashing password
    const user = {
      username:username,
      full_name:full_name,
      email:email,
      password:hashedPassword
    };
    const newUser = await db.User.create(user)
    const response ={
      message: 'User created successfully',
      username:newUser.username
    }
    return new Response(response).created(res);
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }
};



const get = async (req, res) => {
  try {
    const { queryBuilder } = req;
    const user = await db.User.findOne(
      { 
        where: queryBuilder.filters,
        attributes:{exclude:['password','deletedAt']}
      });
    return new Response(user).success(res);
  } catch (err) {
    console.error(err);
    throw new APIError(err, 400);
  }
  };

const update = async (req, res) => {
  try {
    const { id } = req.query;
    const { full_name, username,birth_date } = req.body;

    const user = await db.User.findByPk(id); //user control

    if (!user) {
      throw new APIError('User not found', 404);
    }

    if (full_name) user.full_name = full_name;
    if (username) user.username = username;
    if (birth_date) user.birth_date = birth_date;
    await user.save();

    const response ={
      message: 'User updated successfully',
      username:user.username
    }
    return new Response(response).success(res);
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }

};
const changePassword = async (req, res) => {
  try {
    const { id } = req.query;
    const { password, new_password } = req.body;

    const user = await db.User.findByPk(id); //user control

    if (!user) {
      throw new APIError('User not found', 404);
    }

    const validatedUser = await bcrypt.compare(
      password,
      user.password
    );

    if (!validatedUser) throw new APIError("Password is incorrect!", 401);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt); //hashing password
    user.password = hashedPassword;
    await user.save();
    req.session.destroy(); //destroying current session to force user to login again
    const response ={
      message: 'Password changed successfully',
      username:user.username
    }
    return new Response(response).success(res);
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }

};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await db.User.findByPk(id); //user control

    if (!user) {
      throw new APIError('User not found', 404);
    }
    const deletedUser = await user.destroy();
    req.session.destroy(); //destroying current session to force user to login again
    const response ={
      message: 'User deleted successfully',
      username:deletedUser.username
    }
    return new Response(response).success(res);
  } catch (error) {
    console.error(error);
    throw new APIError(error, 400);
  }
};


module.exports = {
  login,
  register,
  get,
  update,
  changePassword,
  deleteAccount
};