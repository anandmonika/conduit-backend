const {
    getAllTags
} = require("./tag.service");


module.exports = {
    getAllTags : async (req, res) =>{
        try{
            const body = req.body;
            const tag = body.tag;
            const tags = await getAllTags();
            let tagList=[]
            for(let i=0;i<tags.length;i++){
                tagList[i]=tags[i].name;
            }
            return res.json({
                tags: tagList
            })
        }catch(err){
            console.log(err);
            return res.json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
}


