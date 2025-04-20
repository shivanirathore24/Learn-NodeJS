import { MongoClient } from "mongodb";

const url = process.env.DB_URL;

let client;
export const connectToMongoDB = async () => {
  try {
    const clientInstance = await MongoClient.connect(url);
    client = clientInstance;
    console.log("MongoDB is connected");
    const db = client.db();
    await createCounter(db);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

export const getDB = () => {
  if (!client) {
    throw new Error("MongoDB client is not connected.");
  }
  return client.db();
};

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter) {
    console.log("Counter doesn't exist. Creating it...");
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  } else {
    console.log("Counter already exists.");
  }
};
