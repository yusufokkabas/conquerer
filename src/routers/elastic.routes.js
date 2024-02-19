const router = require("express").Router();
const {
    categoryRates,
    userStats,
    postByTime
} = require("../controllers/elastic.controller");

router.get("/categoryrates",categoryRates);
router.get("/userstats",userStats);
router.get("/postbytime",postByTime);

module.exports = router;