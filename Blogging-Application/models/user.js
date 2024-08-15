const {Schema,model}=require('mongoose');
const {createHmac,randomBytes}=require("crypto");
const { createTokenForUser } = require('../services/authentication');

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:"/Images/defaultProfile.svg",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
},{timestamps:true})

userSchema.pre("save",function(next){
    const user=this;

    if(!user.isModified("password"))    return;

    const salt=randomBytes(16).toLocaleString();
    const hashPassword=createHmac("sha256",salt).update(user.password).digest("hex");

    this.salt=salt;
    this.password=hashPassword;

    next();
})

userSchema.static("matchPasswordAndCreateToken",async function(email,password){
    const user=await this.findOne({email});
    if(!user)   throw new Error("User not found");

    const salt=user.salt;
    const hashPassword=user.password;
    const userProvidedPassword=createHmac("sha256",salt).update(password).digest("hex");

    if(userProvidedPassword!==hashPassword){throw new Error("incorrect password");}
    
    const token=createTokenForUser(user);
    return token;
})

const User=model("user",userSchema);

module.exports=User;