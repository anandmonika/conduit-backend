const {verify} = require("jsonwebtoken");

module.exports = {
    makeTokenOptional: (req, res, next) => {
        req._isTokenOptional = true;
        next();
    },
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if(token){
            token = token.slice(6);
            verify(token, "qwe1234", (err, decoded) => {
                if(err){
                    console.log(err)
                    res.json({
                        success:0,
                        message:"Invalid Token"
                    });
                }else{
                    req._user = decoded.result;
                    next();
                }
            });
        }else{
            if(!req._isTokenOptional)
                return res.json({
                    success:0,
                    message:"Access denied! unauthorized user"
                });
            
            next();
        }
    }
}