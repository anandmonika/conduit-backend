const{
    createCommentForArticle,
    getAllCommentsForArticle,
    deleteCommentForArticle
} = require("./comment.controller");

const router = require("express").Router();
const { checkToken, makeTokenOptional } = require("../../auth/token_validation");

//create comment
router.post("/articles/:slug/comments", checkToken, createCommentForArticle);

//get comments
router.get("/articles/:slug/comments", makeTokenOptional, checkToken, getAllCommentsForArticle);

//delete comment
router.delete("/articles/:slug/comments/:id", checkToken, deleteCommentForArticle);
  

module.exports = router;