let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let uuid = require("uuid/v4");

app = express();
let jsonParser = bodyParser.json();
app.use(morgan("dev"));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let blogPosts = [
    {
        id: uuid(),
        title: "How to read",
        content: "Ask your english teacher, they know how to.",
        author: "Travis Pastrana",
        publishDate: new Date(2018,2,3,11,40,0,0)
    },
    {
        id: uuid(),
        title: "I will build a wall",
        content: "I will build the most magnificent wall, it will be beautiful I tell you. And Mexico will pay for it! Covfefe.",
        author: "Trump",
        publishDate: new Date(2017,0,20,12,0,0,0)

    },
    {
        id: uuid(),
        title: "Leeroy Jenkins",
        content: "Leeeeeeeeeeeeeeeeroooooooooooooooooooooooy Jeeeeeeeeeeeeenkiiiiiins.\nSource: https://www.youtube.com/watch?v=mLyOj_QD4a4",
        author: "Leeroy Jenkins",
        publishDate: new Date(2014,5,11,12,0,0,0)
    }
    ];

app.get("/blog-posts", (re, res, next) =>{
    return res.status(200).json(blogPosts);
});

app.get("/blog-post", (req,res) =>{
    let author = req.query.author;
    let authorArr = findObjByAuthor(author);
    if(! author ){
        res.statusMessage = "Missing author in param";
        return res.status(406).json({
            message : "Missing id in param",
            status : 406
        });
    }
    if(! authorArr){
        res.statusMessage = "Author not found";
        return res.status(404).json({
            message : "Author not found",
            status : 404
        });
    }
    return res.status(200).json(authorArr);
});

app.post("/blog-posts", jsonParser, (req,res) => {
    let jsonTitle = req.body.title;
    let jsonContent = req.body.content;
    let jsonAuthor = req.body.author;
    let jsonPublishDate = req.body.publishDate;
    console.log(jsonTitle);
    if(! jsonTitle || ! jsonContent || ! jsonAuthor || ! jsonPublishDate){
        res.statusMessage = "Missing field in body";
        return res.status(406).json({
            message : "Missing field in body",
            status : 406
        });
    }
    else{
        let bPost = {
            id : uuid(),
            title : jsonTitle,
            content : jsonContent,
            author : jsonAuthor,
            publishDate : jsonPublishDate
        };
        blogPosts.push(bPost);
        return res.status(201).json(bPost);
    }
    
});

app.delete("/blog-posts/:id", jsonParser, (req,res) =>{
    let item = findObjById(req.params.id);
    console.log(item);
    if(! item){
        res.statusMessage = "Object not found"; 
        return res.status(404).json({
            message : "Object not found",
            status : 404
        });
    }
    else{
        blogPosts = blogPosts.filter(function(value, index, arr){
            return value != item;
        });
        return res.status(200).json({message : "Deleted Post"});
    }
});

app.put("/blog-posts/:id", jsonParser, (req,res) =>{
    let pId = req.params.id;
    let jsonId = req.body.id;
    let jsonTitle = req.body.title;
    let jsonContent = req.body.content;
    let jsonAuthor = req.body.author;
    let jsonPublishDate = req.body.publishDate;
    if(! jsonId){
        res.statusMessage = "Missing id in body";
        return res.status(406).json({
            message : "Missing id in body",
            status : 406
        });
    }
    else if(jsonId != pId){
        res.statusMessage = "Mismatched id";
        return res.status(409).json({
            message : "Mismatched id",
            status : 409
        });
    }
    else{
        let index = findIndexById(jsonId);
        console.log(index);
        if(index === undefined){
            res.statusMessage = "Object not found";
            return res.status(404).json({
                message : "Object not found",
                status : 404
            });
        }
        else{
            if( jsonTitle !== undefined && jsonTitle != ''){
                blogPosts[index].title = jsonTitle;
            }
            if( jsonContent !== undefined && jsonContent != ''){
                blogPosts[index].content = jsonContent;
            }
            if( jsonAuthor !== undefined && jsonAuthor != ''){
                blogPosts[index].author = jsonAuthor;
            }
            if( jsonPublishDate !== undefined && jsonPublishDate != ''){
                blogPosts[index].publishDate = new Date(jsonPublishDate);
            }
            return res.status(200).json(blogPosts[index])
        }
    }
});

function findObjByAuthor(obj){
    let res;
    blogPosts.forEach(function(item, index, array) {
        if(item.author == obj){
            res = item;
        }
    });
    return res;
}

function findObjById(obj){
    let res;
    blogPosts.forEach(function(item, index, array) {
        if(item.id == obj){
            res = item;
        }
    });
    return res;
}

function findIndexById(obj){
    let res;
    blogPosts.forEach(function(item, index, array) {
        if(item.id == obj){
            res = index;
        }
    });
    return res;
}

app.listen("8080", () => {
    console.log("App is running");
});