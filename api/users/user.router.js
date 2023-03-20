const{
    createUser,
    getUserByUserId,
    getUsers,
    getCurrentUser,
    updateUser,
    deleteUser,
    login,
    getProfile,
    followUser,
    unfollowUser
    } = require("./user.controller");
const router = require("express").Router();
const { checkToken, makeTokenOptional } = require("../../auth/token_validation");

// Authentication
router.post("/users/login",login);

// Register User
router.post("/users", createUser);

// Get currrent user
router.get("/user",checkToken, getCurrentUser);

//Update user
router.put("/user",checkToken, updateUser);

//profile
router.get("/profiles/:username", makeTokenOptional, checkToken, getProfile);

//follow user
router.post("/profiles/:username/follow", checkToken, followUser);

//unfollow user
router.delete("/profiles/:username/follow", checkToken, unfollowUser);

module.exports = router;
