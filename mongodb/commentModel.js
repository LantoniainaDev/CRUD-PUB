const { Schema, model } = require("mongoose");

const commentSchema = Schema({
    content:{
        type:String,
        maxlength:1300,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    target:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
},{timestamp:true})

const Coms = model("comment",commentSchema,"comment");


module.exports = Coms;