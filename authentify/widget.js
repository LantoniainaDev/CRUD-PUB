const jwt = require("jsonwebtoken");
const { User }= require("../mongodb/models");
const key = process.env.KEY;

function createAccount(req,res) {
    console.log(req.body);
    console.log("trying to create account");
    const user = new User(req.body);
    user.save()
        .then(()=>login(req,res))
        .catch((e)=> feedBack(res,e,405)());
}

function login(req,res) {
    const {email,password} = req.body;
    User.findOne({email},(err,doc)=>{
    
        if (doc) {
            doc.compare(password)
             .then(e=>{
                const id = doc._id;
                e ? writeCookie(res,{id}):
                feedBack(res,"mot de passe incorrecte",400)();
             });
        }
        else feedBack(res,err?err:"le compte a ete supprime",400)()
    })
}

function logout(req,res) {
    writeCookie(res,'',{maxAge:0})
    // res.send({msg:"vous vous etes deconnecte avec succes"});
}

function feedBack(res, msg, status = 200) {
    return function () {
        const isString = typeof(msg) == 'string';
        if (isString) {
            res.status(status).send({msg})
            
        }else{
            res.status(status).send(msg);
        }
    }
}

function filterAccess(req,res,next) {
    console.log("filtering");
    function refused() {
        const msg = 'acces refuse';
        res.status(405).send({msg})
    }
    try {
        const token = req.cookies.token || req.query.token;
        const {id} = testCookie(token);
        User.findById(id,(err, doc)=>{
            if (doc && !err) {    
                req.user = doc;
                next();
            }
            else{
                refused();
            }
        })
    }catch (err){
        console.log("l'utilisateur ne s'est encore jamais connecté");
        return refused();
    }
}

function writeCookie(res,data,options={}) {
    const hashed = data? jwt.sign(data, key):'';
    res.cookie("token",hashed,options);
    res.send({cookie:hashed});
    // feedBack(res, "vous etes connecte")();
}

function testCookie(token ="") {
    return jwt.verify(token,key);
}

module.exports = { createAccount, login, logout, filterAccess, testCookie };