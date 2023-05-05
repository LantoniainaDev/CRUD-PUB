const app = require("express").Router();

const allUsers = require("./middleware/allUsers");
const auth = require("./middleware/auth");
const commentaire = require("./middleware/comment");
const publication = require("./middleware/publication");
const user = require("./middleware/user");

// middlewares
app.use('/coms',commentaire);
app.use(auth)
app.use("/user",user);
app.use("/users",allUsers);
app.use('/pubs',publication);

app.get("/",(req ,res)=>{
    res.send("backend is checked")
    console.log("received get request",req.user);
})

module.exports = app;