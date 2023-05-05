const cookieParser = require("cookie-parser");
const express = require("express");
const { filterAccess } = require("../authentify/widget");
const Coms = require("../mongodb/commentModel");
const Pubs = require("../mongodb/publiModel");
const { deleteComsOfPub, sort } = require("../utils");

const publication = express.Router();

//midlewares
publication.use(cookieParser());
publication.use(express.json({urlencoded:true}));

publication.post('/publish',filterAccess,(req,res)=>{
    const { id } = req.user;
    const pub = new Pubs({
        content:req.body.content,
        publisher:id
    });

    pub.save()
        .then((e)=> res.send(e));
})

publication.get("/allpubs",(req,res)=>{
    Pubs.find({},(err,docs)=>{
        res.send(docs.sort(sort));
    })
})

//obtenir toutes les les publication d'un utilisateur
publication.get("/allpubs/:id",(req,res)=>{
    const { id } = req.params;
    Pubs.find({publisher: id},(err,docs)=>{
        if (!err) {
            res.send(docs);
        } else {
            res.sendStatus(500);
        }
    })
})

//supprimer une publication
publication.delete("/post/:id",filterAccess,async (req,res)=>{
    const { id } = req.params;
    const doc = await Pubs.findById(id);
    if (!doc) {
        return res.sendStatus(403);
    }
    const cond = doc.publisher == req.user.id;
    if (cond) {
        console.log("autorisation à supprimer : ",cond);
        deleteComsOfPub(id);
        doc.delete();
        res.send(doc);
    }
    else{
        res.sendStatus(403);
    }
});

//liker une publication
publication.patch("/post/:id",filterAccess,async (req,res)=>{
    const { id } = req.params;
    const pub = await Pubs.findById(id);
    if (!pub) {
        return res.sendStatus(403);
    }
    if (pub.likes.includes(req.user.id)) {
        return res.status(403).send({msg:'vous avez deja like cette publication'})
    }
    pub.likes.push(req.user.id);
    pub.save()
    .then(()=>res.send(pub))
    .catch(()=>res.sendStatus(500));
    
})

module.exports = publication;