const bodyParser = require("body-parser");
const express = require("express");
const { User } = require("../mongodb/models");

const allUsers = express.Router();

allUsers.use(bodyParser({urlencoded:true,extended:true}));

allUsers.get("/",(req,res)=>{
    console.log(req.query);
    const searchFilter = {...req.query};
    //les filtres
    searchFilter.filter = null;
    const filters = req.query.filter? req.query.filter.split(/-?password/).join(" "): ""; 
    User.find(searchFilter,(err,users)=>{
        if (!err) {
            res.send(users);
        }
    })
     .select(filters)
     .select("-password")
})

module.exports = allUsers;