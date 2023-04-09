const { 
    getArticleBySlug 
} = require("../article/article.service");
const {
     getProfile, getUserByUserId
} = require("../users/user.service");
const {
    createCommentForArticle,
    getAllCommentsForArticle,
    deleteCommentForArticle,
    getCommentById
} = require("./comment.service");

module.exports = {
    createCommentForArticle: async (req, res) =>{
        try{
            const body = req.body;
            const comment= body.comment;
            const article = await getArticleBySlug(req.params.slug);
            if(!article){
                return res.json({
                    success: false,
                    message: "Article not found"
                })
            }
            const profile = await getProfile(req._user.username);
            const results = await createCommentForArticle({body:comment.body, article_id: article.id, author_id: profile.id});

            const comment_id = results.insertId;
            const response = {
                comment:{
                    id: results.insertId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    body: comment.body,
                    author:{
                        username: profile.username,
                        bio: profile.bio,
                        image: profile.image,
                        following: false
                    }

                }
            }
            return res.json(response);
        }catch (err){
            console.log(err);
            return res.json({
                success: false,
                message: "Something went wrong"
            });
        }
    },

    getAllCommentsForArticle: async (req, res) =>{
        try{
            const article = await getArticleBySlug(req.params.slug);
            if(!article){
                return res.json({
                    success: false,
                    message: "Article not found"
                })
            }
            const comment = await getAllCommentsForArticle({article_id: article.id})

            const savedComments=[]
            for(let i=0;i<comment.length;i++){
                const newComment = comment[i];
                const author = await getUserByUserId(newComment.author_id);


                savedComments[i]= {
                    id: newComment.id,
                    createdAt: newComment.created_at,
                    updatedAt: newComment.updated_at,
                    body: newComment.body,
                    author:{
                        username: author.username,
                        bio: author.bio,
                        image: author.image,
                        following: false
                    }
                }

            }
            return res.json({comments: savedComments});
        }catch(err){
            console.log(err);
            return res.json({
                success: false,
                message: "Something went wrong"
            });
        }
    },

    deleteCommentForArticle: async(req, res)=>{
        try{
            const slug = req.params.slug;
            const article = await getArticleBySlug(slug);
            if(!article){
                return res.json({
                    success: false,
                    message: "Article not found"
                });
            }
            const id = req.params.id;
            const comment = await getCommentById(id)
            if(!comment){
                return res.json({
                    success: false,
                    message: "Comment not found"
                });
            }
            if(article.id!=comment.article_id){
                return res.json({
                    success: false,
                    message: "Article not found to delete the comment"
                });
            }
            await deleteCommentForArticle({ id: comment.id });
            return res.json({
                sucees: true, 
                message:"Comment deleted",
                comment
            })
        }catch (err) {
            console.log(err);
            return res.json({
                success: false,
                message: "Operation failed"
            });
        }
    }
}