const router = require("express").Router();
const {
    getCategory,
    saveCategory,
} = require("../controllers/category.controller");

router.get("/get",getCategory);
router.post("/save",saveCategory);

module.exports = router;