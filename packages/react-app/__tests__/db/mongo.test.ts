import { MongoMemoryServer } from "mongodb-memory-server";
import {
  insertCancellation,
  connectToDatabase,
  findCancellations,
  isCancelled,
  trackSignature,
  getSignatureTrackingExpiration,
} from "../../src/persistence/mongodb";
import { OrderCancellation } from "../../src/types/types";

describe("MongoDb", () => {
  let mongod: MongoMemoryServer;
  let uri: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    await connectToDatabase(true, uri, "test");
  });

  afterAll(async () => {
    await mongod.stop();
  });

  beforeEach(async () => {
    const { db } = await connectToDatabase(true, uri, "test");
    await db.dropDatabase();
  });

  describe("insertCancellation", () => {
    it("inserts a new cancellation into the database", async () => {
      const cancellation: OrderCancellation = {
        orderHash: "0x1234567890abcdef",
        owner: "0xabcdef1234567890",
        timestamp: 1,
      };
      console.log(cancellation);

      await insertCancellation(cancellation);

      const { db } = await connectToDatabase();
      const collection = db.collection("cancellations");
      const foundCancellation = await collection.findOne({ orderHash: cancellation.orderHash });
      console.log(cancellation);

      expect(foundCancellation).toEqual(cancellation);
    });

    it("does not insert a cancellation if one already exists with the same orderHash", async () => {
      const cancellation: OrderCancellation = {
        orderHash: "0x1234567890abcdef",
        owner: "0xabcdef1234567890",
        timestamp: 1,
      };

      await insertCancellation(cancellation);

      const { db } = await connectToDatabase();
      const collection = db.collection("cancellations");
      const foundCancellation = await collection.findOne({ orderHash: cancellation.orderHash });
      expect(foundCancellation).toEqual(cancellation);

      const newCancellation: OrderCancellation = {
        orderHash: "0x1234567890abcdef",
        owner: "0x0987654321fedcba",
        timestamp: 2,
      };

      await insertCancellation(newCancellation);

      const foundNewCancellation = await collection.findOne({ orderHash: newCancellation.orderHash });
      expect(foundNewCancellation).toEqual(cancellation);
    });
  });

  describe("isCancelled", () => {
    it("should return true if the order has been cancelled", async () => {
      const orderHash = "abc123";
      const { db } = await connectToDatabase();
      const cancellations = db.collection("cancellations");
      await cancellations.insertOne({ orderHash });
      const result = await isCancelled(orderHash);
      expect(result).toBe(true);
    });

    it("should return false if the order has not been cancelled", async () => {
      const orderHash = "abc123";
      const result = await isCancelled(orderHash);
      expect(result).toBe(false);
    });
  });

  describe("findCancellations", () => {
    it("should return an array of cancellations within the given timestamp range", async () => {
      const currentTimestamp = Date.now();
      const fromTimestamp = currentTimestamp - 1000;
      const limit = 10;
      const cancellations = [
        { orderHash: "abc", timestamp: currentTimestamp },
        { orderHash: "def", timestamp: fromTimestamp + 50 },
        { orderHash: "ghi", timestamp: fromTimestamp },
      ];
      const { db } = await connectToDatabase();
      const collection = db.collection("cancellations");
      await collection.insertMany(cancellations);
      const result = await findCancellations(limit, currentTimestamp, fromTimestamp);
      expect(result).toEqual([cancellations[1]]);
    });

    it("should return all cancellations if no timestamps are provided", async () => {
      const before = Date.now() - 1;
      const limit = 10;
      const cancellations = [
        { orderHash: "abc", timestamp: before },
        { orderHash: "def", timestamp: before },
        { orderHash: "ghi", timestamp: before },
      ];
      const { db } = await connectToDatabase();
      const collection = db.collection("cancellations");
      await collection.insertMany(cancellations);
      const result = await findCancellations(limit, Date.now());
      expect(result).toEqual(cancellations);
    });
  });

  describe("trackSignature", () => {
    it("should update an existing signature", async () => {
      const signatureInfo = { orderHash: "abc", expiration: Date.now() };
      const { db } = await connectToDatabase();
      const collection = db.collection("signatures");
      await collection.insertOne(signatureInfo);
      signatureInfo.expiration = Date.now() + 1000;
      await trackSignature(signatureInfo);
      const result = await collection.findOne({ orderHash: "abc" });
      expect(result).toEqual({
        ...signatureInfo,
        expireAt: new Date(signatureInfo.expiration),
      });
    });

    it("should insert a new signature if it does not exist", async () => {
      const signatureInfo = { orderHash: "abc", expiration: Date.now() };
      const { db } = await connectToDatabase();
      const collection = db.collection("signatures");
      await trackSignature(signatureInfo);
      const result = await collection.findOne({ orderHash: "abc" });
      expect({ ...result, _id: undefined }).toEqual({
        ...signatureInfo,
        expireAt: new Date(signatureInfo.expiration),
      });
    });
  });

  describe("getSignatureTrackingExpiration", () => {
    it("should return the expiration of a signature", async () => {
      const orderHash = "abc123";
      const expiration = Date.now();
      const { db } = await connectToDatabase();
      const signatures = db.collection("signatures");
      await signatures.insertOne({ orderHash, expiration });
      const result = await getSignatureTrackingExpiration(orderHash);
      expect(result).toEqual(expiration);
    });

    it("should return undefined if the orderHash does not exist", async () => {
      const orderHash = "abc123";
      const result = await getSignatureTrackingExpiration(orderHash);
      expect(result).toBeUndefined();
    });
  });
});
