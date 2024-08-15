const {Router}=require("express");
const User=require("../models/user");
const router=Router();
const multer  = require('multer');
const path=require("path");
const {createTokenForUser}=require("../services/authentication")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images`));
    },
    filename: function (req, file, cb) {
      const fileName=`${Date.now()}-${file.originalname}`
      cb(null, fileName); 
    }
})

const upload = multer({ storage: storage })

router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.post("/signup",async (req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect("/signin");
});

router.get("/signin",(req,res)=>{
    return res.render('signin');
});

router.get("/Eprofile",(req,res)=>{
    return res.render('Eprofile',{
        user:req.user,
    });
});

router.post("/Eprofile",upload.single("profileImage"),async (req,res)=>{
    await User.updateOne({email:req.user.email},{ $set:{
        fullName:req.body.fullName,
        profileImageURL:`images/${req.file.filename}`
    }});
    const user=await User.findOne({email:req.user.email});
    const token=createTokenForUser(user);
    res.clearCookie("Token");
    res.cookie("Token",token);
    return res.render("Eprofile",{
        msg:"changes made successfully",
        user:user,
    })

})

router.post("/signin",async (req,res)=>{
    const {email ,password}=req.body;
    try{
        const token=await User.matchPasswordAndCreateToken(email,password);
        return res.cookie("Token",token).redirect("/");
    }catch(error){
        return res.render("signin",{
            error:"Invalid Email Or Password",
        });
    }
})


module.exports=router;