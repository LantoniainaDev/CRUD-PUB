const express = require('express');
const auth = express.Router();
const cookieParse = require("cookie-parser");
const { createAccount, login, logout } = require("../authentify/widget");
const bodyParser = require('body-parser');

auth.use(cookieParse());

auth.use(bodyParser({urlencoded:true,extended:true}));


auth.post("/signin",createAccount);
auth.post("/login",login);
auth.get("/logout",logout);

module.exports = auth 