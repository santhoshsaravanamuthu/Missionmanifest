require("dotenv").config();
const express = require('express')
const {connectToMongoDB} = require('./database')
const app = express()
const port = process.env.PORT || 4000;
const router = require('./routes')
const path=require("path");

app.use(express.static(path.join(__dirname,"build")));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"build/index.html"));
})

app.use(express.json());


app.use("/api",router)

async function startserver() {
    await connectToMongoDB();
    app.listen(port,()=>{
        console.log(`Listening to the port ${port}`)
    });
}

startserver();
