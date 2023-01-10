import { generateMock } from "@anatine/zod-mock";
import * as Sdk from "@reservoir0x/sdk";
import { OrderComponents } from "@reservoir0x/sdk/dist/seaport/types";
import { Wallet } from "ethers";
import { when } from "jest-when";
import { createMocks } from "node-mocks-http";
import { chainId } from "../../src/eth";
import handler from "../../src/pages/api/cancellations";
import * as mongo from "../../src/persistence/mongodb";
import { CANCEL_REQUEST_EIP712_TYPE, EIP712_DOMAIN } from "../../src/types/types";
import { MAX_RETURNED_CANCELLATIONS } from "../../src/utils/constants";
import * as time from "../../src/utils/time";
import { SEAPORT_ORDER_SCHEMA } from "../../src/validation/schemas";

jest.mock("../../src/utils/time", () => ({
  getTimestamp: jest.fn(),
}));

jest.mock("../../src/persistence/mongodb", () => ({
  findCancellations: jest.fn(),
  isCancelled: jest.fn(),
  insertCancellation: jest.fn(),
}));

const mockedGetTimestamp = time.getTimestamp as unknown as jest.Mock<typeof time.getTimestamp>;
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

        const signature = await user1._signTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, {
          orderHashes,
        });

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
      });

      it("cancels order if owner requests it", async () => {
        const [orders, orderHashes] = await mockOrders(user1, 1);

        const signature = await user1._signTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, {
          orderHashes,
        });

        const { req, res } = createMocks({
          method: "POST",
          body: { signature, orders },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        const orderHash = orderHashes[0];
        expect(mockedInsertCancellation).toHaveBeenCalledWith({
          orderHash,
          owner: user1.address,
          timestamp: 1,
        });
      });

      it("cancels multiple orders if owner requests it", async () => {
        const [orders, orderHashes] = await mockOrders(user1, 10);

        const signature = await user1._signTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, {
          orderHashes,
        });

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

        const signature = await user2._signTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, {
          orderHashes,
        });

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

        const signature = await user1._signTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, {
          orderHashes,
        });

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
        const dbCancellations = ["test"];
        //@ts-ignore
        when(mockedFindCancellations)
          .calledWith(MAX_RETURNED_CANCELLATIONS, undefined)
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
        const dbCancellations = ["test"];
        const cursor = "100";
        //@ts-ignore
        when(mockedFindCancellations)
          .calledWith(MAX_RETURNED_CANCELLATIONS, cursor)
          //@ts-ignore
          .mockReturnValue(dbCancellations);

        const { req, res } = createMocks({
          method: "GET",
          query: { lastId: cursor },
        });

        await handler(req, res);
        const { cancellations } = res._getJSONData();

        expect(res._getStatusCode()).toBe(200);
        expect(dbCancellations).toEqual(cancellations);
      });
    });
  });
});

async function mockOrders(user: Wallet, numberOfOrders: number): Promise<[OrderComponents[], string[]]> {
  const orders: OrderComponents[] = [];
  const orderHashes: string[] = [];

  for (let i = 0; i < numberOfOrders; i++) {
    const orderData = generateMock(SEAPORT_ORDER_SCHEMA);
    orderData.offerer = user.address;
    const order = new Sdk.Seaport.Order(chainId, orderData);
    await order.sign(user);
    const orderHash = await order.hash();
    orderHashes.push(orderHash);
    orders.push(order.params);
  }

  return [orders, orderHashes];
}
