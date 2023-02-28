import { generateMock } from "@anatine/zod-mock";
import * as Sdk from "@reservoir0x/sdk";
import { OrderComponents } from "@reservoir0x/sdk/dist/seaport/types";
import { Wallet } from "ethers";
import { when } from "jest-when";
import { createMocks } from "node-mocks-http";
import { chainId } from "../../src/eth";
import handler from "../../src/pages/api/replacements";
import * as mongo from "../../src/persistence/mongodb";
import * as time from "../../src/utils/time";
import { SEAPORT_ORDER_SCHEMA } from "../../src/validation/schemas";
import { mockOrders, mockReplacementOrders } from "../utils/mocks";

jest.mock("../../src/utils/time", () => ({
  getTimestamp: jest.fn(),
}));

jest.mock("../../src/persistence/mongodb", () => ({
  getSignatureTrackingExpiration: jest.fn(),
  findCancellations: jest.fn(),
  isCancelled: jest.fn(),
  insertCancellation: jest.fn(),
}));

const mockedGetTimestamp = time.getTimestamp as unknown as jest.Mock<typeof time.getTimestamp>;
const mockedGetSignatureTrackingExpiration = mongo.getSignatureTrackingExpiration as unknown as jest.Mock<
  typeof mongo.getSignatureTrackingExpiration
>;
const mockedFindCancellations = mongo.findCancellations as unknown as jest.Mock<typeof mongo.findCancellations>;
const mockedIsCancelled = mongo.isCancelled as unknown as jest.Mock<typeof mongo.isCancelled>;
const mockedInsertCancellation = mongo.insertCancellation as unknown as jest.Mock<typeof mongo.insertCancellation>;

describe("Replacement API", () => {
  const user1 = Wallet.createRandom();
  const user2 = Wallet.createRandom();

  beforeEach(() => {
    when(mockedGetTimestamp)
      //@ts-ignore
      .mockReturnValue(1);
  });
  afterEach(() => {
    mockedGetTimestamp.mockRestore();
    mockedGetSignatureTrackingExpiration.mockRestore();
    mockedFindCancellations.mockRestore();
    mockedIsCancelled.mockRestore();
    mockedInsertCancellation.mockRestore();
  });

  describe("/api/replacements", () => {
    describe("POST", () => {
      it("patch collection returns 501", async () => {
        const { req, res } = createMocks({
          method: "PATCH",
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(501);
      });

      it("gets collection returns 501", async () => {
        const { req, res } = createMocks({
          method: "GET",
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(501);
      });

      it("returns 400 with empty orders", async () => {
        const orders: OrderComponents[] = [];

        const { req, res } = createMocks({
          method: "POST",
          body: { orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
      });

      it("replaces order if owner requests it and no active signatures", async () => {
        const now = 100;
        //@ts-ignore
        mockedGetTimestamp.mockReturnValue(now);
        const [replacedOrders, hashesToReplace] = await mockOrders(user1, 1);
        const newOrders = await mockReplacementOrders(user1, hashesToReplace);

        const { req, res } = createMocks({
          method: "POST",
          body: { newOrders, replacedOrders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        const orderHash = hashesToReplace[0];
        const { cancellations } = res._getJSONData();
        expect(cancellations[0].timestamp).toBe(now);
        expect(cancellations[0].orderHash).toBe(orderHash);
        expect(mockedInsertCancellation).toHaveBeenCalledWith({
          orderHash: hashesToReplace[0],
          owner: user1.address,
          timestamp: now,
        });
      });

      it("replaces order with active signatures if owner requests it", async () => {
        const now = 100;
        const signatureExpiry = 200;
        //@ts-ignore
        mockedGetTimestamp.mockReturnValue(now);
        //@ts-ignore
        mockedGetSignatureTrackingExpiration.mockReturnValue(signatureExpiry);
        const [replacedOrders, hashesToReplace] = await mockOrders(user1, 1);
        const newOrders = await mockReplacementOrders(user1, hashesToReplace);

        const { req, res } = createMocks({
          method: "POST",
          body: { newOrders, replacedOrders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        const orderHash = hashesToReplace[0];
        const { cancellations } = res._getJSONData();
        expect(cancellations[0].timestamp).toBe(signatureExpiry);
        expect(cancellations[0].orderHash).toBe(orderHash);
        expect(mockedInsertCancellation).toHaveBeenCalledWith({
          orderHash: hashesToReplace[0],
          owner: user1.address,
          timestamp: signatureExpiry,
        });
      });

      it("cancels multiple orders if owner requests it", async () => {
        //@ts-ignore
        mockedGetSignatureTrackingExpiration.mockReturnValue(1);
        const [replacedOrders, hashesToReplace] = await mockOrders(user1, 5);
        const newOrders = await mockReplacementOrders(user1, hashesToReplace);

        const { req, res } = createMocks({
          method: "POST",
          body: { newOrders, replacedOrders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(mockedInsertCancellation).toHaveBeenNthCalledWith(1, {
          orderHash: hashesToReplace[0],
          owner: user1.address,
          timestamp: 1,
        });
        expect(mockedInsertCancellation).toHaveBeenNthCalledWith(2, {
          orderHash: hashesToReplace[1],
          owner: user1.address,
          timestamp: 1,
        });
        expect(mockedInsertCancellation).toHaveBeenNthCalledWith(3, {
          orderHash: hashesToReplace[2],
          owner: user1.address,
          timestamp: 1,
        });
        expect(mockedInsertCancellation).toHaveBeenNthCalledWith(4, {
          orderHash: hashesToReplace[3],
          owner: user1.address,
          timestamp: 1,
        });
        expect(mockedInsertCancellation).toHaveBeenNthCalledWith(5, {
          orderHash: hashesToReplace[4],
          owner: user1.address,
          timestamp: 1,
        });
      });

      it("returns 400 if replacement signer is wrong", async () => {
        const [replacedOrders, hashesToReplace] = await mockOrders(user1, 1);
        const newOrders = await mockReplacementOrders(user2, hashesToReplace);

        const { req, res } = createMocks({
          method: "POST",
          body: { newOrders, replacedOrders },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
      });

      it("returns 400 if number of orders do not match", async () => {
        const [replacedOrders, hashesToReplace] = await mockOrders(user1, 1);
        const newOrders = await mockReplacementOrders(user1, [...hashesToReplace, "111"]);

        const { req, res } = createMocks({
          method: "POST",
          body: { newOrders, replacedOrders },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
      });

      it("return 400 if salt missing", async () => {
        const orders = [];
        let orderData = generateMock(SEAPORT_ORDER_SCHEMA);
        orderData.offerer = user1.address;
        orderData.salt = "0";
        let order = new Sdk.SeaportV14.Order(chainId, orderData);
        await order.sign(user1);
        orders.push(order.params);

        const { req, res } = createMocks({
          method: "POST",
          body: { orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
      });

      it("return 400 if inconsistent offerers", async () => {
        const orders = [];
        let orderData = generateMock(SEAPORT_ORDER_SCHEMA);
        orderData.offerer = user1.address;
        let order = new Sdk.SeaportV14.Order(chainId, orderData);
        await order.sign(user1);
        orders.push(order.params);
        let orderData2 = generateMock(SEAPORT_ORDER_SCHEMA);
        orderData2.offerer = user1.address;
        let order2 = new Sdk.SeaportV14.Order(chainId, orderData2);
        await order2.sign(user2);
        orders.push(order2.params);

        const { req, res } = createMocks({
          method: "POST",
          body: { orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
      });
    });
  });
});
