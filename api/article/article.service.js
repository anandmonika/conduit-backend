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
    },

    getArticleBySlug: (slug) =>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `select * from articles where slug = ?`,
                [
                    slug
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

    getFavoritesByArticleId: (id) => {
        return new Promise((resolve, reject) =>{
            pool.query(
                `select * from favorites where article_id=?`,
                [
                    id
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
    
    getAllArticles: (data) =>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `select * from articles order by id desc limit ? offset ?`,
                [
                    data.limit,
                    data.offset
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
    getArticlesCount: ()=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `select count(*) articles_count from articles`,
                [],
                (error, results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    }, 

    getArticlesByAuthor: (data)=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `select * from articles where author_id in (select id from users where username = ?) order by id desc limit ? offset ?`,
                [
                    data.username,
                    data.limit,
                    data.offset
                ],
                (error,results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    getArticlesByTag: (data)=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `select * from articles where id in (select article_id from article_tag where tag_id in (select id from tags where name=?)) order by id desc limit ? offset ?;`,
                [
                    data.name,
                    data.limit,
                    data.offset
                ],
                (error,results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

    getArticlesFavoritedByusername: (data)=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `select *from articles where id in(select article_id from favorites where user_id in (select id from users where username=?)) orderby id desc limit ? offset ?;`,
                [
                    data.username,
                    data.limit,
                    data.offset
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
    deleteArticle: (slug)=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `delete from articles where slug=?`,
                [
                    slug
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
    favoriteArticle: (data)=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `insert into favorites (article_id, user_id) values(?,?)`,
                [
                    data.article_id,
                    data.user_id
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
    unfavoriteArticle: (slug)=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `delete from articles where slug =?`,
                [
                    slug
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
    updateArticle: (data)=>{
        return  new Promise((resolve, reject) =>{
           let update = '';
           if(data.title)
           update += `title = "${data.title}" , slug = "${data.slug}"`

           if(data.description)
           update += `${update ? ',':''} description ="${data.description}"`

           if(data.body)
           update += `${update ? ',':''} body ="${data.body}"`
            pool.query(
                `update articles set ${update} where id=?`,
                [
                    data.id
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
    getFeedArticles: (data)=>{
        return new Promise((resolve, reject) =>{
            pool.query(
                `select * from articles where author_id in(select user_id from followers where  follower_id = ?)`,
                [
                    data.follower_id
                ],
                (error, results) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                }
            )
        })
    }
}