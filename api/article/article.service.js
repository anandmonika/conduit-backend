const pool = require("../../config/database");
module.exports = {
        createArticle: (data) =>{
            return new Promise((resolve, reject) => {
                pool.query(
                `insert into articles(title, description, body, slug, author_id) values(?,?,?,?,?)`,
                [
                    data.title,
                    data.description,
                    data.body,
                    data.slug,
                    data.author_id
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