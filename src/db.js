import mongo from "mongodb";

// spajanje na mongo

let connection_string =
  "mongodb+srv://admin:admin@cluster0.upjf8.mongodb.net/test/";

let client = new mongo.MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = null;

function isConnected() {
  return !!client && !!client.topology && client.topology.isConnected;
}

export default async () => {
  if (!db || !isConnected()) {
    await client.connect();
    db = client.db("pfinder");
    console.log("Connected OK");
  }
  return db;
};
