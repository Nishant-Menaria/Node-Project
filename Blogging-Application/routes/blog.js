const {Router}=require("express");
const router=Router();
const multer  = require('multer');
const path=require("path");
const Blog=require("../models/blog");
const Comment=require("../models/comment");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName=`${Date.now()}-${file.originalname}`
      cb(null, fileName); 
    }
})
  
const upload = multer({ storage: storage })

router.get("/addBlog",(req,res)=>{
    res.render("addBlog",{
        user:req.user,
    });
})

router.get("/myBlog",async (req,res)=>{
    const userId=req.user._id;
    const userBlogs=await Blog.find({createdBy:userId});
    return res.render('home',{
        user:req.user,
        blogs:userBlogs,
    });
})

router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const blogComments= await Comment.find({blogId:blog._id}).populate("createdBy");
    return res.render('blog',{
        user:req.user,
        blog:blog,
        comments:blogComments,
    })
})

router.post("/comment/:blogId",async(req,res)=>{
    await Comment.create({
        comment:req.body.comment,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/",upload.single("coverImage"),async (req,res)=>{
    const {title,body}=req.body;
    const blog=await Blog.create({
        title,
        body,
        coverImage:`/uploads/${req.file.filename}`,
        createdBy:req.user._id
    });
    return res.redirect(`/blog/${blog._id}`);
})

module.exports=router;