const bodyParser = require('body-parser');
const { filterAccess } = require('../authentify/widget');
const Coms = require('../mongodb/commentModel');
const { sort } = require('../utils');

const commentaire = require('express').Router();

commentaire.use(bodyParser({
    urlencoded:true,
    extended:true
}))

commentaire.get("/:id",async (req,res)=>{
    const { id } = req.params;
    const coms = await Coms.find({target:[id]})
    if (!coms) {
        return res.sendStatus(403);
    }
    res.send(coms.sort(sort));
})

commentaire.post("/:target",filterAccess,(req,res)=>{
    const { target } = req.params;
    const { content } = req.body,
     author = req.user.id;
    const comment = new Coms({content,target, author})

    comment.save()
     .then(()=>res.send(comment))
     .catch(()=>res.sendStatus(500));

})

//modifier un commentaire et le supprimer
commentaire.put("/:id",filterAccess, async (req,res)=>{
    const author = req.user.id;
    const {id} = req.params;

    const com = await Coms.findOne({_id:id,author});
    if (!com) {
        return res.sendStatus(500)
    }
    com.content = req.body.content;
    com.save()
     .then(res.send(com))
     .catch(e=>res.send(e));
})

commentaire.delete("/:id",filterAccess,async(req,res)=>{
    const { id } = req.params;
    const author = req.user.id;

    console.log("deleting comment");

    const deleted = await Coms.findOneAndRemove({_id:id,author},{returnDocument:true});
    res.send({com: deleted});
})

module.exports = commentaire;