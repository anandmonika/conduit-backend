const{
    createArticle
} = require("./article.controller");

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");


// create article
router.post("/articles", checkToken, createArticle);

module.exports = router;