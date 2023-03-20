const pool = require("../../config/database");
module.exports = {
    create: (data) => {
        return new Promise((resolve, reject)=>{
        console.log(data);
        pool.query(
            'insert into users (username, email,password, bio, image) values(?,?,?,?,?)' ,
            [
                data.username,
                data.email,
                data.password,
                data.bio,
                data.image
            ],
            (error, results) => {
                if(error){
                    return reject(error);
                }
                return resolve(results);
            }
        );
        })
    },
    getUsers: ()=>{
        return new Promise((resolve, reject)=>{
    pool.query(
        `select id, username, email, bio, image from users`,
        [],
        (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        }
        );
    })
    },
    getUserByUserId: (id) =>{
        return new Promise((resolve, reject) =>{
        pool.query(
            `select id, username, email, bio, image, password from users where id=?`,
            [id],
            (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results[0]);
                }
            );
        })
    },
    getUserByUserEmail:(email)=>{
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from users where email=?`,
                [email],
                (error, results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    updateUser: (data)=>{
        return new Promise((resolve, reject)=>{
        pool.query(
            `update users set username=?, email=?, password=?, bio=?, image=? where id=?`,
            [
                data.username,
                data.email,
                data.password,
                data.bio,
                data.image,
                data.id
            ],
            (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            }
        );
    })
},
    deleteUser: (data) => {
        return new Promise((resolve, reject)=>{
        pool.query(
            `delete from users where id = ?`,
            [data.id],
            (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results[0]);
            }
        );
    })
},
    getProfile: (username) => {
        return new Promise ((resolve, reject)=>{
            pool.query(
                `select id, username, bio, image from users where username = ?`,
                [username],
                (error, results)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    getFollowing: (data) => {
        return new Promise ((resolve, reject)=>{
            pool.query(
                `select * from followers where follower_id=? and user_id=?`,
                [data.follower_id,
                 data.user_id
                ],
                (error, results)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results[0]);
                }

            )
        });
    },

    followUser: (data) =>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `insert into followers (follower_id, user_id) values (?, ?)`,
                [
                    data.follower_id,
                    data.user_id
                ],
                (error, results) => {
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    
    unfollowUser: (data) =>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `delete from followers where follower_id=? and user_id=?`,
                [
                    data.follower_id,
                    data.user_id
                ],
                (error, results) => {
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    }
}