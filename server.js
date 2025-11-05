var express = require("express");
var server = express();


server.get("/", (req,res)=>{
    res.send("Hello world!");
})

server.get("/about", (req,res)=>{
    res.send("My first NodeJS server!");
})

server.listen(8080)