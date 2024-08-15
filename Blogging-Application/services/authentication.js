const JWT=require("jsonwebtoken");

const secret="NISHANT@2004";

function createTokenForUser(user){
    const payLoad={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
    };
    const token=JWT.sign(payLoad,secret,);
    return token;
}

function verifyToken(token){
    return JWT.verify(token,secret);
}

module.exports={
    createTokenForUser,
    verifyToken
}