const pool = require("../../config/database");
module.exports ={
    getTagByName: (data) =>{
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from tags where name=?`,
                [
                    data.name
                ],
                (error, results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    createTag: (data) =>{
        return new Promise((resolve, reject) => {
            pool.query(
                `insert into tags (name) values (?)`,
                [
                    data.name
                ],
                (error, results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    attachTagToArticle: (data) =>{
        return new Promise((resolve, reject) => {
            pool.query(
                `insert into article_tag (article_id, tag_id) values (?,?)`,
                [
                    data.article_id,
                    data.tag_id
                ],
                (error, results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    }
}