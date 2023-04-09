const{
    createArticle,
    getArticleBySlug,
    getAllArticles,
    deleteArticle,
    favoriteArticle,
    unfavoriteArticle,
    updateArticle,
    getFeed
} = require("./article.controller");

const router = require("express").Router();
const { checkToken, makeTokenOptional } = require("../../auth/token_validation");


// create article
router.post("/articles", checkToken, createArticle);

//feed article
router.get("/articles/feed", checkToken, getFeed);

//get single article by slug
router.get("/articles/:slug", getArticleBySlug);

//get all articles 1
router.get("/articles",makeTokenOptional, checkToken, getAllArticles);


//delete article
router.delete("/articles/:slug", checkToken, deleteArticle);


//favorite article
router.post("/articles/:slug/favorite", checkToken, favoriteArticle);

//unfavorite article
router.delete("/articles/:slug/favorite", checkToken, unfavoriteArticle);

//update article
router.put("/articles/:slug", checkToken, updateArticle);



module.exports = router;