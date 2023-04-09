const { 
     getTagByName,
     createTag,
     attachTagToArticle,
     getTagByArticle
     } = require("../Tag/tag.service");
const {
     getProfile, getUserByUserId 
     } = require("../users/user.service");
const {
    createArticle,
    getArticleBySlug,
    getFavoritesByArticleId,
    getAllArticles,
    getArticlesCount,
    getArticlesByAuthor,
    getArticlesByTag,
    getArticlesFavoritedByusername,
    deleteArticle,
    favoriteArticle,
    unfavoriteArticle, 
    updateArticle,
    getFeedArticles
    } = require("./article.service");

const controllers = {
        createArticle : async (req, res) =>{
            try {
                const body = req.body;
                const article = body.article;
                article.slug = article.title.toLowerCase().replace(/\s+/g, '-');
                article.author_id = req._user.id;
                const results = await createArticle(article);
                const profile =await getProfile(req._user.username);
                const article_id =results.insertId;
                //step-1: check tag exists or not in tag table
                //step-2: if exists tag_id inserted in article_tag table with article_id
                //step-3: if not exists tag will be inserted into tag table with id then perform step 2
                for(let i=0; i<article.tagList.length; i++){
                    const tag = article.tagList[i];
                    const savedTag = await getTagByName({ name: tag });
                    let tag_id;
                    if(!savedTag) {
                        const inserted = await createTag({ name: tag });
                        tag_id = inserted.insertId;
                    } else {
                        tag_id = savedTag.id;
                    }
                    
                    await attachTagToArticle({ article_id, tag_id });

                }
                const response = {
                    article:{
                        id: article_id,
                        slug: article.slug,
                        title: article.title,
                        description: article.description,
                        body: article.body,
                        tagList: article.tagList,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        favorited: false,
                        favoritesCount: 0,
                        author:{
                            username: profile.username,
                            bio: profile.bio,
                            image:profile.image,
                            following: false
                        },
                        
                    }
                }
                return res.json(response);
            } catch (err) {
                console.log(err);
                return res.json({ 
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    getArticleBySlug: async(req, res) => {
        try{
            const slug = req.params.slug;
            const article =await getArticleBySlug(slug);
            if(!article) {
                return res.json({
                    success : false,
                    data : "Article not found"
                });
            }
            const [tag, favorites, author] = await Promise.all([getTagByArticle({article_id: article.id}), getFavoritesByArticleId(article.id), getUserByUserId(article.author_id)])
            const tagList = [];
            for(let i=0;i<tag.length;i++){
                tagList[i]=tag[i].name;
            }

            return res.json({
                article: {
                    id: article.id,
                    slug: article.slug,
                    title: article.title,
                    description: article.description,
                    body: article.body,
                    tagList: tagList,
                    createdAt: article.created_at, 
                    updatedAt: article.updated_at, 
                    favorited: false,
                    favoritesCount: favorites.length,
                    author:{
                        username: author.username ,
                        bio: author.bio,
                        image: author.image,
                        following: false
                    }
                }
            }) 
        } catch (err) {
            console.log(err);
        return res.json({
            success: 0,
            message: "Something went wrong"
        });
    }

},
getFeed: async(req,res)=>{
    req.query.feed = true;
    await controllers.getAllArticles(req, res);
},
getAllArticles: async(req, res) =>{
    try{
        const  authorUsername = req.query.author;
        const tagName = req.query.tag;
        const favoritedByUsername = req.query.favorited;
        const isFeed = req.query.feed;
        const limit = Number(req.query.limit) || 20;
        const offset = Number(req.query.offset) || 0;
        
        if(authorUsername){
            getArticlePromise = getArticlesByAuthor({ username: authorUsername , limit, offset});
        }else if(tagName){
            getArticlePromise = getArticlesByTag({name: tagName, limit, offset});
        }else if(favoritedByUsername){
            getArticlePromise = getArticlesFavoritedByusername({username: favoritedByUsername, limit, offset})
        }else if(isFeed){
            getArticlePromise = getFeedArticles({follower_id: req._user.id });
        }else {
            getArticlePromise = getAllArticles({limit, offset});
        }
        const [articles,articlesCount] = await Promise.all ([getArticlePromise,getArticlesCount()]);
        const savedArticles = []
        for(let i=0;i<articles.length;i++){
            const article = articles[i];

            const [tag, favorites,author] = await Promise.all([getTagByArticle({article_id: article.id}), getFavoritesByArticleId(article.id), getUserByUserId(article.author_id)])
            const tagList = [];
            for(let i=0;i<tag.length;i++){
                tagList[i] = tag[i].name;
            }
            
            savedArticles[i] = {
                id: article.id,
                slug: article.slug,
                title: article.title,
                description: article.description,
                body: article.body,
                tagList: tagList,
                createdAt: article.created_at, 
                updatedAt: article.updated_at, 
                favorited: false,
                favoritesCount: favorites.length,
                author:{
                    username: author.username ,
                    bio: author.bio,
                    image: author.image,
                    following: false
                } 
            } 
        }
        return res.json({articles: savedArticles, articlesCount:articlesCount.articles_count});
    }catch(err){
        console.log(err);
        return res.json({
            success: 0,
            message: "Something went wrong"
        });
    }
},

    deleteArticle : async (req, res)=>{
        try{
            const slug = req.params.slug;
            const article = await getArticleBySlug(slug);
            if(!article){
                return res.json({
                    success: false,
                    message: "Article not found"
                });
            }
            if(req._user.id!=article.author_id){ 
                return res.json({
                    success: false,
                    message: "User not authorized to delete the article "
                });
            }
            await deleteArticle(article.slug);
            return res.json({
                success : true,
                message:"Article deleted",
                article
            })
        }catch (err) {
            console.log(err);
            return res.json({
                success: false,
                message : "operation failed"
            });
        }
    },

    favoriteArticle : async (req, res)=>{
        try{
            const slug = req.params.slug;
            const article = await getArticleBySlug(slug);
            if(!article){
                return res.json({
                    success: false,
                    message: "Article not found"
                });
            }
            await favoriteArticle({article_id: article.id, user_id: req._user.id});
            return res.json({
                success: true,
                message: "Article favorited",
                article
            })
        }catch (err) {
            console.log(err);
            return res.json({
                success: false,
                message : "operation failed"
            });
        }
    },
    unfavoriteArticle: async(req,res)=>{
        try{
            const slug = req.params.slug;
            const article = await getArticleBySlug(slug);
            if(!article){
                return res.json({
                    success: false,
                    message: "Article not found"
                });
            }
            await unfavoriteArticle(slug);
            return res.json({
                success: true,
                message: "Article unfavorited",
                article
            });
        }catch(err) {
            console.log(err);
            return res.json({
                success: false,
                message: "Operation failed"
            });
        }
    },

    updateArticle: async (req,res)=>{
        try{
            const slug = req.params.slug;
            const savedArticle = await getArticleBySlug(slug);
            if(!savedArticle){
                return res.json({
                    success: false,
                    message: "Article not found"
                })
            }
            const article = req.body.article;
            if(article.title){
                article.slug = article.title.toLowerCase().replace(/\s+/g, '-');
            }
            await updateArticle({ id: savedArticle.id, ...article})
            return res.json({
                success: true,
                message: "Article updated",
                article: {
                    ...savedArticle,
                    ...article
                }
            })
        } catch(err) {
            console.log(err);
            return res.json({
                success: false,
                message: "Operation failed"
            });
        }
    }
}

module.exports = controllers;
