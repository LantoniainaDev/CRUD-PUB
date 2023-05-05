const Coms = require("./mongodb/commentModel");
const Pubs = require("./mongodb/publiModel")
const del = p=>p.delete(),
deleteComsOfPub = async (pubId)=>{
    const comToDelete = await Coms.find({target:pubId});
    comToDelete.map(del);
},
deleteComsOfUser = async (userId)=>{
    const comToDelete = await Coms.find({author:userId});
    comToDelete.map(del);
};

module.exports.deletePubOf = async (UserId)=>{
    
    const pubToDelete = await Pubs.find({publisher:UserId});
    pubToDelete.map(e=>{
        deleteComsOfPub(e.id);
        del(e);
    });
    deleteComsOfUser(UserId);
}

module.exports.sort = (a,b)=>b.date-a.date;


module.exports.deleteComsOfPub = deleteComsOfPub;

module.exports.deleteComsOfUser = deleteComsOfUser;