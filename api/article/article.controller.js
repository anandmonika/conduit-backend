const {
    getAllArticles,
    getArticlesByAuthor,
    getArticlesFavoritedByUsername,
    getArticlesByTag
} = require("./article.service");

const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");