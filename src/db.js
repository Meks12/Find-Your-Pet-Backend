import mongo from "mongodb";


    let connection_string = "mongodb://localhost:27017/";
   
    let client = new mongo.MongoClient(connection_string, {
        useNewUrlParser: true,
         useUnifiedTopology: true });

    let db = null;
    
    function isConnected(){
        return !!client && !!client.topology && client.topology.isConnected
    }

    export default async () =>{
        if (!db || !isConnected()) {
            await client.connect();
            db = client.db("petfinder");
            console.log("Connected OK");
        }
        return db;
    }