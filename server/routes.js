const express = require("express")
const routes = express.Router()
const {getConnectedClient} = require("./database")
const {ObjectId} = require("mongodb")

const getCollection = () =>{
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}

routes.get("/todos",async (req,res)=>{
    const collection =getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);

});

routes.post("/todos",async (req,res)=>{
    const collection = getCollection();
    let {todo} = req.body;
    const newTodo =await collection.insertOne({todo,status:false})
    if(!todo){
        return res.status(400).json({mssg:"Error No todo Found"});
    }
    todo=(typeof todo === "string") ? todo: JSON.stringify(todo);
 
    res.status(201).json({todo,status:false,_id: newTodo.insertedId});
});

routes.delete("/todos/:id",async(req,res)=>{
    const collection = getCollection();
    const _id = new  ObjectId(req.params.id);
    const deleteone = await collection.deleteOne({_id})
    res.status(200).json(deleteone);
});

routes.put("/todos/:id",async(req,res)=>{
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const {status} = req.body;
    if(typeof status!="boolean"){
        return res.status(400).json({mssg:"Invalid Input"});
    }
    const updateone = await collection.updateOne({_id},{$set:{status:!status}});
    res.status(200).json(updateone);
});

module.exports=routes;