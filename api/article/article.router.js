const{
    getAllArticles,
    getArticlesByAuthor,
    getArticlesFavoritedByUsername,
    getArticlesByTag
} = require("./article.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");


router.get("/articles", getArticles);

module.exports = router;