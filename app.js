//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const  mongoose = require("mongoose");
const {Schema} = mongoose;
const _ = require("lodash");

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

const listSchema = {
    name:String,
    items: [itemsSchema]
}

const List = mongoose.model("List",listSchema);


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
    const listName = req.body.list;

    const item = new Item(
        {
            name: itemName
        });

        if (listName == "Today"){
        item.save();

        res.redirect("/");
      }
      else
      {
        List.findOne({name: listName}).then(
          function(foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/"+listName);
        })
      }
    
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Today")
    {
      Item.findByIdAndRemove(checkedItemId).then(function () {
        console.log("Successfully removed item");
    }).catch(function(err)
    {
        console.log(err);
    })

    res.redirect("/");
    }
    else 
    {
      List.findOneAndUpdate(
        {name:listName},{$pull:{items: {_id :checkedItemId}}}
      ).then(function()
      {
        console.log("deleted item from database");
      }).catch(function(err)
      {
          console.log(err);
      });
      res.redirect("/"+ listName);
  }
});


app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName}).then(
        function(foundList){
        
            //check if list doesn't exist
            if(!foundList){
              //create new list
              const list = new List({
                name:customListName,
                items:defaultItems
              });
            
              list.save();
              console.log("saved");
              res.redirect("/"+customListName);
            }
            else{
              //show existing list
              res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
            }
      })
      .catch(function(err){});
   
   
});

app.post("/work",function(req,res){
        let item = req.body.newItem;
        workItems.push(item);
        res.redirect("/work");
});

app.get("/about",function(req,res){
res.render("about")
});
