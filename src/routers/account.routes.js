const router = require("express").Router();
const { tokenCheck } = require("../middlewares/auth");
const {
    login,
    register,
    get,
    update,
    changePassword,
    deleteAccount
} = require("../controllers/account.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const sessionCheck = require("../middlewares/sessionCheck");
router.post("/register",authValidation.register,register);
router.post("/login",authValidation.login,login);
router.post("/changepassword",authValidation.changePassword,sessionCheck,changePassword);
router.get("/get",sessionCheck,tokenCheck,get);
router.post("/update",sessionCheck,tokenCheck,update);
router.delete("/delete",sessionCheck,tokenCheck,deleteAccount);

module.exports = router;