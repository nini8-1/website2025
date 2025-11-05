var express = require("express");
var server = express();
var bodyParser = require("body-parser");

server.use(express.static(__dirname+"/Public")); 
server.use(bodyParser.urlencoded());

server.get("/", (req,res)=>{
    res.send("Hello world!");
})

server.get("/about", (req,res)=>{
    res.send("My first NodeJS server!");
})

server.listen(8080)