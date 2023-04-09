const{
    getAllTags
} = require("./tag.controller");

const router = require("express").Router();


//get tags
router.get("/tags", getAllTags);

module.exports = router;