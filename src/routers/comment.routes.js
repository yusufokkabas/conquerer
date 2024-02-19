const router = require("express").Router();
const {
    getComments,
    saveComment,
    deleteComment
} = require("../controllers/comment.controller");

router.get("/get",getComments);
router.post("/save",saveComment);
router.delete("/delete",deleteComment);

module.exports = router;