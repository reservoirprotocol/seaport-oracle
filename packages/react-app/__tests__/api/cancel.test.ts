import { generateMock } from "@anatine/zod-mock";
import * as Sdk from "@reservoir0x/sdk";
import { OrderComponents } from "@reservoir0x/sdk/dist/seaport/types";
import { Wallet } from "ethers";
import { when } from "jest-when";
import { createMocks } from "node-mocks-http";
import { signCancelRequest } from "../../src/eip712";
import { chainId } from "../../src/eth";
import handler from "../../src/pages/api/cancellations";
import { MAX_RETURNED_CANCELLATIONS } from "../../src/utils/constants";
import { SEAPORT_ORDER_SCHEMA } from "../../src/validation/schemas";
import { mockOrders } from "../utils/mocks";
import * as mongo from "../../src/persistence/mongodb";
import * as time from "../../src/utils/time";

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

describe("Cancellation API", () => {
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

  describe("/api/cancellations", () => {
    describe("POST", () => {
      it("patch collection returns 501", async () => {
        const { req, res } = createMocks({
          method: "PATCH",
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(501);
      });

      it("returns 400 with empty orders", async () => {
        const orders: OrderComponents[] = [];
        const orderHashes: string[] = [];

        const signature = await signCancelRequest(user1, orderHashes);

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
      });

      it("cancels order if owner requests it and no active signatures", async () => {
        const now = 100;
        //@ts-ignore
        mockedGetTimestamp.mockReturnValue(now);
        const [orders, orderHashes] = await mockOrders(user1, 1);

        const signature = await signCancelRequest(user1, orderHashes);

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        const orderHash = orderHashes[0];
        const { cancellations } = res._getJSONData();
        expect(cancellations[0].timestamp).toBe(now);
        expect(cancellations[0].orderHash).toBe(orderHash);
        expect(mockedInsertCancellation).toHaveBeenCalledWith({
          orderHash,
          owner: user1.address,
          timestamp: now,
        });
      });

      it("cancels order with active signatures if owner requests it", async () => {
        const now = 100;
        const signatureExpiry = 200;
        //@ts-ignore
        mockedGetTimestamp.mockReturnValue(now);
        //@ts-ignore
        mockedGetSignatureTrackingExpiration.mockReturnValue(signatureExpiry);
        const [orders, orderHashes] = await mockOrders(user1, 1);

        const signature = await signCancelRequest(user1, orderHashes);

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        const orderHash = orderHashes[0];
        const { cancellations } = res._getJSONData();
        expect(cancellations[0].timestamp).toBe(signatureExpiry);
        expect(cancellations[0].orderHash).toBe(orderHash);
        expect(mockedInsertCancellation).toHaveBeenCalledWith({
          orderHash,
          owner: user1.address,
          timestamp: signatureExpiry,
        });
      });

      it("cancels multiple orders if owner requests it", async () => {
        //@ts-ignore
        mockedGetSignatureTrackingExpiration.mockReturnValue(1);
        const [orders, orderHashes] = await mockOrders(user1, 10);

        const signature = await signCancelRequest(user1, orderHashes);

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(mockedInsertCancellation).toHaveBeenCalledTimes(orderHashes.length);
      });

      it("return 401 if non owner requests cancellation", async () => {
        const [orders, orderHashes] = await mockOrders(user1, 1);

        const signature = await signCancelRequest(user2, orderHashes);

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(401);
      });

      it("return 400 if non owner requests multiple cancellation", async () => {
        const orders = [];
        const orderHashes: string[] = [];
        let orderData = generateMock(SEAPORT_ORDER_SCHEMA);
        orderData.offerer = user1.address;
        let order = new Sdk.Seaport.Order(chainId, orderData);
        await order.sign(user1);
        let orderHash = await order.hash();
        orderHashes.push(orderHash);
        orders.push(order.params);
        orderData = generateMock(SEAPORT_ORDER_SCHEMA);
        orderData.offerer = user2.address;
        order = new Sdk.Seaport.Order(chainId, orderData);
        await order.sign(user2);
        orderHash = await order.hash();
        orderHashes.push(orderHash);
        orders.push(order.params);

        const signature = await signCancelRequest(user1, orderHashes);

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
      });
    });

    describe("GET", () => {
      it("returns last cancellations without cursor", async () => {
        const now = 200;
        const dbCancellations = ["test"];
        //@ts-ignore
        mockedGetTimestamp.mockReturnValue(now);
        //@ts-ignore
        when(mockedFindCancellations)
          .calledWith(MAX_RETURNED_CANCELLATIONS, now, undefined)
          //@ts-ignore
          .mockReturnValue(dbCancellations);

        const { req, res } = createMocks({
          method: "GET",
        });
        await handler(req, res);
        const { cancellations } = res._getJSONData();
        expect(res._getStatusCode()).toBe(200);
        expect(dbCancellations).toEqual(cancellations);
      });

      it("returns last cancellations with cursor", async () => {
        const now = 200;
        const dbCancellations = ["test"];
        const cursor = 100;
        //@ts-ignore
        mockedGetTimestamp.mockReturnValue(now);
        //@ts-ignore
        when(mockedFindCancellations)
          .calledWith(MAX_RETURNED_CANCELLATIONS, now, cursor)
          //@ts-ignore
          .mockReturnValue(dbCancellations);

        const { req, res } = createMocks({
          method: "GET",
          query: { fromTimestamp: cursor },
        });

        await handler(req, res);
        const { cancellations } = res._getJSONData();

        expect(res._getStatusCode()).toBe(200);
        expect(dbCancellations).toEqual(cancellations);
      });
    });
  });
});
