var express=require("express");
var session=require("express-session");
var app=express();
var client=require("./func/dbConnect").client;
var ejs=require("ejs");
var bodyParser=require("body-parser");
var fs=require("fs"),
    welcome=fs.readFileSync("../frontend/index.html","utf8"),
    index=fs.readFileSync("../frontend/view/main/main.html","utf8"),
    borrow=fs.readFileSync("../frontend/view/borrow/borrow.html","utf8"),
    giveback=fs.readFileSync("../frontend/view/return/return.html","utf8"),
    cardpage=fs.readFileSync("../frontend/view/card/card.html","utf8"),
    bookmng=fs.readFileSync("../frontend/view/bookmng/bookmng.html","utf8");
var login=require("./router/admin_login");
var action=require("./router/book_action");
var search=require("./router/book_search");
var card=require("./router/lib_card");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// parse application/json
app.use(bodyParser.json());

app.use(express.static("../frontend"));

app.use(session({
    secret:'19951102',
    name:'gkrbox',
    cookie:{maxAge:9000000},
    resave:false,
    saveUninitialized:true
}));

app.get("/",function(req,res){
    res.send(welcome);
});

app.get("/index",function(req,res){
    res.send(index);
});

app.get("/borrow",function(req,res){
    var ret=ejs.render(borrow,{
        login:req.session.login,
        userName:req.session.userName
    });

    res.send(ret);
});

app.get("/return",function(req,res){
    var ret=ejs.render(giveback,{
        login:req.session.login,
        userName:req.session.userName
    });

    res.send(ret);
});

app.get("/cardpage",function(req,res){
    var ret=ejs.render(cardpage,{
        login:req.session.login,
        userName:req.session.userName
    });

    res.send(ret);
});

app.get("/bookmng",function(req,res){
    var ret=ejs.render(bookmng,{
        login:req.session.login,
        userName:req.session.userName
    });
    res.send(ret);
});

app.use("/",login);

app.use("/action",action);

app.use("/search",search);

app.use("/card",card);


app.listen(8080,function(){
    console.log("Set up on 127.0.0.1:8080");
});
