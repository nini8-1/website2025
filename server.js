var express = require("express");
var server = express();
var bodyParser = require("body-parser");

server.use(express.static(__dirname+"/Public")); 
server.use(bodyParser.urlencoded());

server.get("/", (req,res)=>{
    res.send("11Hello world!");
})
server.get("/services", (req,res)=>{     //db      var Services= [                 {icon:'fa-shopping-cart', title:'E-Commerce', text:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur porro laborum fuga repellat necessitatibus corporis nulla, in ex velit recusandae obcaecati maiores, doloremque quisquam similique, tempora aspernatur eligendi delectus! Rem.'},                 {icon:'fa-laptop', title:'Responsive Design', text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.'},                 {icon:'fa-lock', title:'Web Security', text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.'}             ]     res.send(Services); })
server.get("/about", (req,res)=>{
    res.send("My first NodeJS server!");
})

server.listen(8080)


const main = document.querySelector("main");

gsap.set("main", { perspective: 650 });

const outerRX = gsap.quickTo(".contact-page-logo-outer", "rotationX", { ease: "power3" });
const outerRY = gsap.quickTo(".contact-page-logo-outer", "rotationY", { ease: "power3" });
const innerX = gsap.quickTo(".contact-pagesvg-logo", "x", { ease: "power3" });
const innerY = gsap.quickTo(".contact-pagesvg-logo", "y", { ease: "power3" });

main.addEventListener("pointermove", (e) => {
  outerRX(gsap.utils.interpolate(15, -15, e.y / window.innerHeight));
  outerRY(gsap.utils.interpolate(-15, 15, e.x / window.innerWidth));
  innerX(gsap.utils.interpolate(-30, 30, e.x / window.innerWidth));
  innerY(gsap.utils.interpolate(-30, 30, e.y / window.innerHeight));
});

main.addEventListener("pointerleave", (e) => {
  outerRX(0);
  outerRY(0);
  innerX(0);
  innerY(0);
});}
