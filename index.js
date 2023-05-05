require("dotenv").config({path:"./.env"});

const cookieParser = require("cookie-parser");
const express = require("express");
const { join } = require("path");
const app = require("./app");
const { filterAccess } = require("./authentify/widget")

const cors = require("cors");

const serveur = express();

const dir = join(__dirname, "dist");

serveur.use(cors({credentials:true}));
serveur.use(cookieParser());
serveur.use("/api",app);
serveur.use(express.static(dir));
serveur.use(filterAccess);

serveur.enable("trusted proxy");

const port = process.env.PORT;

serveur.listen(port,()=>console.log(`serveur démaré au port ${port} `))