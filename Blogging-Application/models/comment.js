const {Schema,model}=require("mongoose");

const commentSchema= new Schema({
    comment:{
        type:String,
        require:true
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:"blog",
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
    }
},{timestamps:true});

const comment=model('comment',commentSchema);

module.exports=comment;