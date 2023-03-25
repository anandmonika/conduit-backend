const { getTagByName, createTag, attachTagToArticle } = require("../Tag/tag.service");
const { getProfile } = require("../users/user.service");
const {
    createArticle
} = require("./article.service");

module.exports = {
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
    }
}