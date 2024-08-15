const {verifyToken}=require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenValue=req.cookies[cookieName];
        if(!tokenValue)
            return next();

        try{
            const userPayLoad=verifyToken(tokenValue);
            req.user=userPayLoad;
        }catch(e){}
        return next();
    }
}

module.exports={
    checkForAuthenticationCookie,
}