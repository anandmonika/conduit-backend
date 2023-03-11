const{
    createUser,
    getUserByUserId,
    getUsers,
    getCurrentUser,
    updateUser,
    deleteUser,
    login
    } = require("./user.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

// Authentication
router.post("/users/login",login);

// Register User
router.post("/users", createUser);

// Get currrent user
router.get("/user",checkToken, getCurrentUser);

//Update user
router.put("/user",checkToken, updateUser);


// ------------------------------------------
router.get("/users", checkToken, getUsers);
router.get("/users/:id", checkToken, getUserByUserId);
router.delete("/users", checkToken, deleteUser);

module.exports = router;
