import express from "express";
import cors from "cors";
import connect from "./db.js";
import  mongo  from "mongodb";


const app = express()
const port = 3001


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Ovaj get služi za dohvaćanje podataka koji su poslani POST metodom

app.get("/prijavanestanka", async (req, res) =>{
    let db = await connect();
    let kolekcija = db.collection("/prijavanestanka");
    let cursor = await kolekcija.find();
    let data = await cursor.toArray();

    res.json(data);
});


// U ovoj post metodi iz frontenda uzimam ime ljubimca kojeg zelimo prijaviti kao nestalog, broj mobitela, mjesto gdje je zadnji put viđen, vrstu psa, njegov spol te datum nestanka. 
// na frontendu pomoću gumba spremi saljem ovdje podatke

app.post("/prijavanestanka", async (req,res) => {
    let doc = req.body;
    console.log(doc);

    let db = await connect();
    let kolekcija = db.collection("/prijavanestanka");

    let result = await kolekcija.insertOne(doc)

    res.status(201);
    res.send();
});


// Delete služi kako bi izbrisao prijavu nestanka koja je spremljena u bazi. Brišem tako da mu dam specifičan id koji je jedinstven za svaku prijavu nestanka.

app.delete("/prijavanestanka/:id", async (req,res) =>{
    let doc = req.body;
    let id = req.params.id;

    delete doc._id;

    let db = await connect();

    let result = await db.collection("/prijavanestanka").deleteOne({_id: mongo.ObjectId(id)}, {$set: doc});

    if (result && result.deletedCount == 1) {
      res.json({status: "Deleted"});
    } else {
      res.json({status: "Failed"});
    }

  });


// Patch služi za ispravljanje eventualnih pogrešaka nakon slanja u bazu podataka. Radi tako da prosljedimo id prijave koje želimo mijenjat. 
// 4 crud funkcionalnosti


  app.patch("/prijavanestanka/:id", async (req,res) =>{
    let doc = req.body;
    let id = req.params.id;

    delete doc._id;

   let db = await connect();

   let result = await db.collection("/prijavanestanka").updateOne({_id: mongo.ObjectId(id)}, {$set: doc});
    
   if (result && result.modifiedCount == 1) {
    let doc = await db.collection("/prijavanestanka").findOne({_id: mongo.ObjectId(id)});
    res.json(doc);
   } else {
    res.json({ status: "Failed"});
   }

  });





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});