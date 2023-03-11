const {
    create,
    getUserByUserId,
    getUsers,
    updateUser,
    deleteUser,
    getUserByUserEmail
} = require("./user.service");

const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");

module.exports = {
    createUser : async (req, res) => {
        try {
            const body = req.body;
            const user = body.user;
            const salt = genSaltSync(10);
            user.password = hashSync(user.password, salt);
            const results = await create(user);
            // send token
            const savedUser = {
                id: results.insertId,
                email: user.email,
                username: user.username,
                bio: user.bio || null,
                image: user.image || null
            }
            const jsontoken = sign({result: savedUser}, "qwe1234", {expiresIn:"1h"});
            console.log("results:",results);
            const response = {
                user: {
                    id: results.insertId,
                    email: user.email,
                    token: jsontoken,
                    username: user.username,
                    bio: user.bio || null,
                    image: user.image || null
                }
            }

            return res.status(200).json(response);
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Email or password already exists"
            });
        }
    },
    getUserByUserId : (req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success : 0,
                    message :"Record not found"
                });
            }
            return res.json({
                success : 1,
                data : results
            });
        });
    },
    getUsers : (req, res) => {
        getUsers((err, results) => {
            if (err){
                console.log(err);
                return;
            }
            return res.json({
                success : 1,
                data : results
            });
        });
    },
    getCurrentUser : async (req, res) =>{
        try{
            const user = await getUserByUserId(req._user.id);
            delete user.password;
            return res.json({
                user
            })
        }catch(err){
            console.log(err);
            return res.status(400).json({
                success: 0,
                message: "Something went wrong"
            });
        }    
    },
    updateUser: async (req, res) =>{
        try{
            const body = req.body;
            const user=body.user;
            if(user.password) {
                const salt = genSaltSync(10);
                user.password = hashSync(user.password, salt);
            }
            const savedUser = await getUserByUserId(req._user.id);

            const update = {
                id: req._user.id,
                email: user.email || savedUser.email,
                username: user.username || savedUser.username,
                password: user.password || savedUser.password,
                image: user.image || savedUser.image,
                bio: user.bio || savedUser.bio
            }

            const results = await updateUser(update);
            delete update.password;

            if(!results){
                return res.json({
                    success : 0,
                    message : "Failed to update user"
                });
            }
        
            return res.json({
                message : "updated successfully",
                user: update
            });

        }catch(err) {
            console.log(err);
            return res.status(400).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },
    deleteUser: async (req, res) => {
        const data = req.body;
        deleteUser(data, (err, results) =>{
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success : 0,
                    message : "Record Not Found"
                });
            }
            return res.json({
                success : 1,
                message : "user deleted successfully"
            });

        });
    },
    login: async (req, res) => {
        try {
            const body = req.body;
            const user = body.user;
            const savedUser = await getUserByUserEmail(user.email);

            if(!savedUser){
                return res.json({
                    success : 0,
                    data : "Invalid email or password"
                });
            }

            const result = compareSync(user.password, savedUser.password);
            
            if(result){
                savedUser.password = undefined;
                const jsontoken = sign({result: savedUser}, "qwe1234", {expiresIn:"1h"});
                savedUser.token = jsontoken;
                return res.json({
                    user : savedUser
                });
             }else{
                return res.json({
                    success : 0,
                    data : "Invalid email or password"
                });
             }

        } catch(err) {
            console.log(err);
        }
    }

};
