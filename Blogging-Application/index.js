require('dotenv').config()

const express=require('express');
const path=require('path');
const userRoutes=require('./routes/user');
const blogRoutes=require('./routes/blog');
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const {checkForAuthenticationCookie}=require("./middleware/authentication");
const Blog=require("./models/blog");



const port=8000;
const app=express();


mongoose.connect("mongodb://localhost:27017/blogify").then((e)=>{
    console.log("Db connected Successfully");
});

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("Token"));
app.use(express.static(path.resolve("./public")));


app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlogs,
    });
});


app.get("/logout",(req,res)=>{
    res.clearCookie("Token").redirect("/");
})

app.use("/blog",blogRoutes);
app.use("/user",userRoutes);

app.listen(port,()=>{console.log("Server Started Successfully")});