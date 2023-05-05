const cookieParser = require('cookie-parser');
const {  filterAccess } = require('../authentify/widget');
const { User } = require('../mongodb/models');

const express = require('express');
const bodyParser = require('body-parser');
const { deletePubOf, deleteComsOfPub } = require('../utils');
const user = express.Router();

//les midlewares
user.use(cookieParser());
user.use(bodyParser({urlencoded:true,extended:true}))

user.get("/",filterAccess,(req,res)=>{
    /**
     * renvoit les donnees de l'utilisateur
     * si et suelement s'il est connecte
     * autrement renvoit un status 400
     */

    try {
        const {id} = req.user;
        findAndSend(id,res).select('-password');
    } catch (err) {
        console.warn('le compte a ete supprime');
        res.sendStatus(400);
    }

})

user.get('/:id',(req,res)=>{
    const { id } = req.params;
    var filter= req.query.filter || "";
    if (filter) filter = filter.split(/-?password/).join(" ");
    findAndSend(id,res).select(filter);
})

user.put("/",filterAccess,(req,res)=>{
    const { _id } = req.user;
    const { password,name,firstname} = req.body;
    const modif = { password,name,firstname};
    console.log('trying to modify:',modif);
    console.log('with id :', _id);
    User.findOneAndUpdate({_id},{
            $set:modif
        },
        {new:true,upsert:true, setDefaultsOnInsert:true},
        (err,doc)=>{
            if (doc) {
                res.send(doc);
            } else {
                console.log(err);
                const msg = "votre jeton de connexion est corrompu"
                res.status(400).send({msg})
            }
    }).select('-password');
        
     
    
})

user.delete("/:id",filterAccess,(req,res)=>{
    const { id } = req.params;
    console.log(req.user.id);
    const cond1 = id == req.user.id;
    if (cond1) {
        User.findOneAndDelete({_id:id},
            {
                returnDocument:true,
            },(err,doc,res)=>{
                console.log(doc.id," a supprimé son compte");
                if (!err) {
                    console.log(doc);
                    deletePubOf(id);
                    success();
                } else {
                    fail(err);
                }
            })
    } else {
        fail()
    }

    function success(msg = "votre compte a bien été supprimé") {
        //s'assurer que l,utilisateur soit deconnecté
        res.cookie("token","",{maxAge:2});

        res.send({msg});
    }
    function fail(err ={err:"échec de l'opération"}) {
        res.status(500).send(err);
    }
})

function findAndSend(id, res) {
    return User.findById(id,(err,doc)=>{
        if (doc) {
            res.send(doc)
        }else{
            console.log(err);
            res.sendStatus(400);
        }
    }).select('-password')
}

module.exports = user;