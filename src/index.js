import express from "express";
import cors from "cors";

import connect from "./db.js"

const app = express()
const port = 3001


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});


let counter = 0;

app.get("/prijavanestanka", async (req, res) =>{
    console.log(++counter);
    let db = await connect();
    let kolekcija = db.collection("/prijavanestanka");
    let cursor = await kolekcija.find();
    let data = await cursor.toArray();

    res.json(data);
});


app.post("/prijavanestanka", async (req,res) => {
    let doc = req.body;
    console.log(doc);

    let db = await connect();
    let kolekcija = db.collection("/prijavanestanka");

    let result = await kolekcija.insertOne(doc)

    res.status(201);
    res.send();
});

/*
app.delete("/prijavanestanka/:id", (req,res) =>{
    let { id } = req.params;
})
*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});