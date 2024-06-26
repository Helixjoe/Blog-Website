//jshint esversion:6

const express = require("express");
const lodash = require('lodash');
const mongoose = require('mongoose');
const homeStartingContent = ["Home", "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."];
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();

app.set('view engine', 'ejs');
//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongoose
mongoose.connect('mongodb://127.0.0.1:27017/postsDB');

const postSchema = new mongoose.Schema({
  title: String,
  post: String
});

const Post = mongoose.model('post', postSchema);

const startingPost = new Post({
  title: "Home",
  post: homeStartingContent
});


function insertRecord(postContent) {

  Post.insertMany(postContent)
    .then(function () {
      console.log("Successfully saved defult items to DB");
    })
    .catch(function (err) {
      console.log(err);
    });
};


// Api Routes
const foundPostArr = [];
app.get("/", (req, res) => {
  async function run() {
    const foundPosts = await Post.find();
    foundPostArr.push(foundPosts);
    insertRecord(foundPosts);
    console.log(foundPosts);
    res.render("home", {
      startingContent: homeStartingContent,
      newPosts: foundPosts
    });
  };
  run();
})

app.get("/posts/:postId", (req, res) => {
  const requiredId = req.params.postId;
  foundPostArr[0].forEach((post) => {
    const storedId = post._id;
    if (requiredId == storedId) {
      console.log("Match Found");
      res.render("post", { postTitle: post.title, postContent: post.post });
    }
  });

})
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
})

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
  const postContent = new Post({
    title: req.body.contentTitle,
    post: req.body.contentPost
  });
  insertRecord(postContent);
  Post.save();
  res.redirect("/");
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
