const pool = require("../../config/database");
module.exports = {
        createCommentForArticle: (data) =>{
            return new Promise((resolve, reject)=>{
                pool.query(
                    `insert into comments(body, author_id, article_id) values(?,?,?)`,
                    [
                        data.body,
                        data.author_id,
                        data.article_id
                    ],
                    (error, results) =>{
                        if(error) {
                            return reject(error);
                            }
                            return resolve(results);
                       }
                );
            })
        },

       getAllCommentsForArticle: (data) =>{
            return new Promise((resolve, reject)=>{
                pool.query(
                    `select * from comments where article_id=?`,
                    [
                        data.article_id
                    ],
                    (error, results) =>{
                        if(error){
                            return reject(error);
                        }
                        return resolve(results);
                    }
                )
            })
       },
       getCommentById: (id)=>{
        return new Promise((resolve, reject)=>{
            pool.query(
                `select * from comments where id=?`,
                [
                    id
                ],
                (error, results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            )
        })
    },

       deleteCommentForArticle:(data)=>{
            return new Promise((resolve,reject)=>{
                pool.query(
                    `delete from comments where id=?`,
                    [
                        data.id
                    ],
                    (error, results)=>{
                        if(error){
                            return reject(error);
                        }
                        return resolve(results);
                    }
                )
            })
       }
}