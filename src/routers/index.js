const router = require("express").Router();
const sessionCheck = require("../middlewares/sessionCheck");
const createQuery = require("../middlewares/queryBuilder");
const { tokenCheck } = require("../middlewares/auth");

   const account = require("./account.routes")
   const category = require("./category.routes")
   const post = require("./post.routes")
   const comment = require("./comment.routes");
   const elastic = require("./elastic.routes");

   router.use("/account",createQuery,account)
   router.use("/category",sessionCheck,tokenCheck,createQuery,category)
   router.use("/post",sessionCheck,tokenCheck,createQuery,post)
   router.use("/comment",sessionCheck,tokenCheck,createQuery,comment)
   router.use("/elastic",sessionCheck,tokenCheck,createQuery,elastic)
module.exports = router;
