//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const  mongoose = require("mongoose");
const {Schema} = mongoose;


const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(3000, 
    function(){
    console.log("Server started on port 3000"); }
);

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {useNewUrlParser : true});
 
const itemsSchema = new Schema({
  name :  String
});
 
const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
  _id : 1,
  name:"Welcome to your ToDo List!"});
const item2 = new Item({
  _id : 2,
  name:"Hit the + button to add new item."});
const item3 = new Item({
  _id :3,
  name:"<-- Hit this to delete an item."});
 
const defaultItems = [item1, item2, item3];

 


app.get("/", function(req,res)
{
    Item.find().then(function(foundItems){
        if (foundItems.length === 0) {
          Item.insertMany(defaultItems).then(function(){
            console.log("Succesfully saved all the items to todolistDB");
          })
          .catch(function (err) {
            console.log(err);
          });
          res.redirect("/");
        } else {
          res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
   });
});

app.post("/", function(req,res)
{   
    const itemName = req.body.newItem;
    
    const item = new Item(
        {
            name: itemName
        });

        item.save();

        res.redirect("/")
    
});

app.get("/work", function(req,res){
     res.render("list", {listTitle: "Work List",newListItems: workItems });
});

app.post("/work",function(req,res){
        let item = req.body.newItem;
        workItems.push(item);
        res.redirect("/work");
});

app.get("/about",function(req,res){
res.render("about")
});