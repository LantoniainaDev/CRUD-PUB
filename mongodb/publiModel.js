const { Schema, model } = require("mongoose");

const pubSchema = Schema({
    content:{
        type:String,
        maxlenght:1300
    },
    date:{
        type:Date,
        default:Date.now()
    },
    publisher:{
        type:String,
        required:true
    },
    likes:{
        type:[String],
        default:[]
    },
},{timestamp:true})

const Pubs = model('publicatios',pubSchema);

module.exports = Pubs;