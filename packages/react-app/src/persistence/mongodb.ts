import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { OrderCancellation } from "../types/types";

const MONGODB_URI = process.env.MONGO_URL;
const MONGODB_DB = process.env.DB_NAME ?? "cancelx";

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

// check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI!!, opts as MongoClientOptions);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

export async function insertCancellation(cancellation: OrderCancellation) {
  const { db } = await connectToDatabase();
  const collection = db.collection("cancellations");
  const cancellationFound = await collection.findOne({ orderHash: cancellation.orderHash });
  if (!cancellationFound) {
    collection.insertOne(cancellation);
  }
}

export async function isCancelled(orderHash: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  const cancellation = await db.collection("cancellations").findOne({ orderHash });
  return !!cancellation;
}

export async function findCancellations(limit: number, lastId?: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection("cancellations");
  let query;
  if (lastId) {
    query = collection.find({ _id: { $gt: lastId } });
  } else {
    query = collection.find({});
  }
  return await query.sort({ _id: 1 }).limit(limit).toArray();
}
