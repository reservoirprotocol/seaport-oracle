import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { OrderCancellation, SignatureInfo } from "../types/types";

const MONGODB_URI = process.env.MONGO_URL;
const MONGODB_DB = process.env.DB_NAME ?? "breakwater";
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

export async function connectToDatabase(
  forceRefresh?: boolean,
  uri: string = MONGODB_URI!,
  db_name: string = MONGODB_DB!,
) {
  // check the cached.
  if (!forceRefresh && cachedClient && cachedDb) {
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
  let client = new MongoClient(uri, opts as MongoClientOptions);
  await client.connect();
  let db = client.db(db_name);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

const createTTLIndex = async (db: Db) => {
  const signatureCollection = db.collection("signatures");
  // create a background index on the expireAt field
  await signatureCollection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  console.log("createTTLIndex Done!");
};

export async function insertCancellation(cancellation: OrderCancellation) {
  const { db } = await connectToDatabase();
  const collection = db.collection<OrderCancellation>("cancellations");
  const cancellationFound = await collection.findOne({ orderHash: cancellation.orderHash });
  if (!cancellationFound) {
    await collection.insertOne(cancellation);
  }
}

export async function isCancelled(orderHash: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  const cancellation = await db.collection<OrderCancellation>("cancellations").findOne({ orderHash });
  return !!cancellation;
}

export async function findCancellations(limit: number, currentTimestamp: number, fromTimestamp?: number) {
  const { db } = await connectToDatabase();
  const collection = db.collection<OrderCancellation>("cancellations");
  let query;
  if (fromTimestamp) {
    // we use strict ordering functions so that the query is stable even when we append future cancellations
    query = collection.find({ timestamp: { $gt: fromTimestamp, $lt: currentTimestamp } });
  } else {
    query = collection.find({});
  }
  return await query.sort({ timestamp: 1, orderHash: 1 }).limit(limit).toArray();
}

export async function trackSignature(signatureInfo: SignatureInfo) {
  // Signature expirations are based on block timestamps so they are in seconds
  const expirationInMillis = signatureInfo.expiration * 1000;
  const { db } = await connectToDatabase();
  const collection = db.collection<SignatureInfo>("signatures");
  await collection.updateOne(
    { orderHash: signatureInfo.orderHash },
    // expireAt is used to support a TTL index
    { $set: { expiration: expirationInMillis, expireAt: new Date(expirationInMillis) } },
    { upsert: true },
  );
}

export async function getSignatureTrackingExpiration(orderHash: string): Promise<number | undefined> {
  const { db } = await connectToDatabase();
  const collection = db.collection<SignatureInfo>("signatures");
  const signatureInfo = await collection.findOne({ orderHash });
  return signatureInfo?.expiration;
}
