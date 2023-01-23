//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://shikha:Jannat1.@cluster0.mibfqzw.mongodb.net/blogDB");

const postSchema = {
  title:String,
  content:String
};

const Post = mongoose.model("Post", postSchema);

const nodejs = new Post({
  title: "Gratitude",
  content:"In positive psychology research, gratitude is strongly and consistently associated with greater happiness. Gratitude helps people feel more positive emotions, relish good experiences, improve their health, deal with adversity, and build strong relationships."
})
const database = new Post({
  title: "Benifits of Journaling",
  content:"When you were a teenager, you might have kept a diary hidden under your mattress. It was a place to confess your struggles and fears without judgment or punishment. It likely felt good to get all of those thoughts and feelings out of your head and down on paper. The world seemed clearer. You may have stopped using a diary once you reached adulthood. But the concept and its benefits still apply. Now it’s called journaling. It's simply writing down your thoughts and feelings to understand them more clearly. And if you struggle with stress, depression, or anxiety, keeping a journal can be a great idea. It can help you gain control of your emotions and improve your mental health."
})

const defaultPosts = [nodejs, database];



const homeStartingContent = "Hey there! welcome to Daily Journal this is a blog posting website created using node js and mongodb, tools I have used to create this website are express, ejs, bootstrap, html and css for database I have used mongoose, to deploy this simple yet effective website on internet I took help of Heroku and for database mongoDB Atlas. hope you will post here good content and enjoy reading already posted blogs.";
const contactContent = "Hey there! thank you for visting Daily Journal if you have any query or you want to give us any feedback feel free to use below form.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  Post.find({},function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      if(foundPost.length === 0){
        Post.insertMany(defaultPosts, function(err){
          if(err){
            console.log(err);
          }
        });
        res.redirect("/");
      }else{
        res.render("home", {homeContent:homeStartingContent, posts:foundPost});
      }
    }
  })

})


app.get("/contact", function(req, res){
  res.render("contact", {contactContent:contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){

  const post = new Post({
    title:req.body.postTitle,
    content:req.body.postBody
  })
  post.save();
  res.redirect("/");
})

app.get("/posts/:postName", function(req, res){
  let urlparam = req.params.postName;

  Post.findOne({title:urlparam}, function(err, foundPost){
    if(!err){
      const foundTitle = foundPost.title;
      const foundContent = foundPost.content;
      res.render("post",{
        title:foundTitle,
        content : foundContent
      })
    }
  })


});






let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("server has started successfully.");
});
