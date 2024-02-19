const router = require("express").Router();
const {
    getPost,
    savePost,
    updatePost,
    deletePost
} = require("../controllers/post.controller");

router.get("/get",getPost);
router.post("/save",savePost);
router.post("/update",updatePost);
router.delete("/delete",deletePost);

module.exports = router;