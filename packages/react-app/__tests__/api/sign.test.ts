import { constants, Wallet } from "ethers";
import { BytesLike, defaultAbiCoder, keccak256, verifyTypedData, _TypedDataEncoder } from "ethers/lib/utils";
import { when } from "jest-when";
import { createMocks } from "node-mocks-http";
import { hashConsideration, recoverOrderSigner } from "../../src/eip712";
import { wallet } from "../../src/eth";
import handler from "../../src/pages/api/sign/";
import * as mongo from "../../src/persistence/mongodb";
import * as reservoir from "../../src/reservoir";
import { mockOrders, toReceivedItems } from "../utils/mocks";

jest.mock("../../src/reservoir", () => ({
  fetchFlagged: jest.fn(),
}));

jest.mock("../../src/persistence/mongodb", () => ({
  findCancellations: jest.fn(),
  isCancelled: jest.fn(),
  insertCancellation: jest.fn(),
}));

const mockedFetchFlagged = reservoir.fetchFlagged as unknown as jest.Mock<typeof reservoir.fetchFlagged>;
const mockedGetCancellations = mongo.findCancellations as unknown as jest.Mock<typeof mongo.findCancellations>;
const mockedIsCancelled = mongo.isCancelled as unknown as jest.Mock<typeof mongo.isCancelled>;
const mockedInsertCancellation = mongo.insertCancellation as unknown as jest.Mock<typeof mongo.insertCancellation>;
const chainId = parseFloat(process.env.NEXT_PUBLIC_CHAIN_ID ?? "1");

describe("Sign Order API", () => {
  afterEach(() => {
    mockedFetchFlagged.mockRestore();
    mockedGetCancellations.mockRestore();
    mockedIsCancelled.mockRestore();
    mockedInsertCancellation.mockRestore();
  });

  describe("/api/sign", () => {
    it("returns signature for non cancelled single order", async () => {
      const [mockedOrders, orderHashes] = await mockOrders(Wallet.createRandom(), 1);
      const consideration = toReceivedItems(mockedOrders[0].consideration);
      const orderHash = orderHashes[0];
      const fulfiller = constants.AddressZero;

      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(orderHash)
        //@ts-ignore
        .mockReturnValue(false);

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders, considerations: [consideration], fulfiller },
      });

      await handler(req, res);

      const { orders } = res._getJSONData();
      expect(res._getStatusCode()).toBe(200);
      const order = orders[0];
      const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);

      const context: BytesLike = hashConsideration(consideration);
      const signer = recoverOrderSigner(fulfiller, decoded[2], orderHash, context, decoded[3]);

      expect(signer).toBe(wallet.address);
      expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
    });

    it("returns signature for non cancelled multiple orders", async () => {
      const batchSize = 3;
      const [mockedOrders, orderHashes] = await mockOrders(Wallet.createRandom(), batchSize);
      const considerations = mockedOrders.map(o => toReceivedItems(o.consideration));
      const fulfiller = constants.AddressZero;
      const anyOrderHash = when(arg => orderHashes.includes(arg));

      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(anyOrderHash)
        //@ts-ignore
        .mockReturnValue(false);

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders, considerations, fulfiller },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);

      const { orders } = res._getJSONData();
      expect(res._getStatusCode()).toBe(200);
      expect(orders.length).toBe(batchSize);

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
        const context: BytesLike = hashConsideration(considerations[i]);
        const signer = recoverOrderSigner(fulfiller, decoded[2], orderHashes[i], context, decoded[3]);

        expect(signer).toBe(wallet.address);
        expect(mockedIsCancelled).toHaveBeenCalledWith(orderHashes[i]);
      }
    });

    it("returns error if token flagged on single order", async () => {
      const [mockedOrders, orderHashes] = await mockOrders(Wallet.createRandom(), 1, true);
      const consideration = toReceivedItems(mockedOrders[0].consideration);
      const orderHash = orderHashes[0];
      const fulfiller = constants.AddressZero;
      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(orderHash)
        //@ts-ignore
        .mockReturnValue(false);

      mockedFetchFlagged.mockReturnValue(
        //@ts-ignore
        Promise.resolve(new Set([`${consideration[0].token}:${consideration[0].identifier}`])),
      );

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders, considerations: [consideration], fulfiller },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const { orders, errors } = res._getJSONData();
      expect(orders.length).toEqual(0);
      expect(errors[0].error).toEqual("FlaggedTokenInConsideration");
    });

    it("returns signatures and errors when some orders are flagged", async () => {
      const batchSize = 3;
      const [mockedOrders, orderHashes] = await mockOrders(Wallet.createRandom(), batchSize, true);
      const considerations = mockedOrders.map(o => toReceivedItems(o.consideration));
      const fulfiller = constants.AddressZero;
      const anyOrderHash = when(arg => orderHashes.includes(arg));

      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(anyOrderHash)
        //@ts-ignore
        .mockReturnValue(false);

      mockedFetchFlagged.mockReturnValue(
        //@ts-ignore
        Promise.resolve(new Set([`${considerations[2][0].token}:${considerations[2][0].identifier}`])),
      );
      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders, considerations, fulfiller },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);

      const { orders, errors } = res._getJSONData();
      expect(orders.length).toEqual(2);
      expect(errors[0].error).toEqual("FlaggedTokenInConsideration");
      //The last order of the batch is removed
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
        const context: BytesLike = hashConsideration(considerations[i]);
        const signer = recoverOrderSigner(fulfiller, decoded[2], orderHashes[i], context, decoded[3]);

        expect(signer).toBe(wallet.address);
        expect(mockedIsCancelled).toHaveBeenCalledWith(orderHashes[i]);
      }
    });

    it("returns error if order is cancelled on single order", async () => {
      const [mockedOrders, orderHashes] = await mockOrders(Wallet.createRandom(), 1, true);
      const consideration = toReceivedItems(mockedOrders[0].consideration);
      const orderHash = orderHashes[0];
      const fulfiller = constants.AddressZero;
      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(orderHash)
        //@ts-ignore
        .mockReturnValue(true);

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders, considerations: [consideration], fulfiller },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const { orders, errors } = res._getJSONData();
      expect(orders.length).toEqual(0);
      expect(errors[0].error).toEqual("OrderCancelled");
    });

    it("returns signatures and errors when some orders are cancelled", async () => {
      const batchSize = 3;
      const [mockedOrders, orderHashes] = await mockOrders(Wallet.createRandom(), batchSize, false);
      const considerations = mockedOrders.map(o => toReceivedItems(o.consideration));
      const fulfiller = constants.AddressZero;
      const lastOrderHash = when(arg => orderHashes[2] === arg);

      mockedIsCancelled.mockReturnValue(
        //@ts-ignore
        false,
      );

      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(lastOrderHash)
        //@ts-ignore
        .mockReturnValue(true);

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders, considerations, fulfiller },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);

      const { orders, errors } = res._getJSONData();
      expect(orders.length).toEqual(2);
      expect(errors[0].error).toEqual("OrderCancelled");
      //The last order of the batch is removed
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
        const context: BytesLike = hashConsideration(considerations[i]);
        const signer = recoverOrderSigner(fulfiller, decoded[2], orderHashes[i], context, decoded[3]);

        expect(signer).toBe(wallet.address);
        expect(mockedIsCancelled).toHaveBeenCalledWith(orderHashes[i]);
      }
    });

    it("returns signatures and errors when some orders are cancelled and flagged", async () => {
      const batchSize = 3;
      const [mockedOrders, orderHashes] = await mockOrders(Wallet.createRandom(), batchSize, true);
      const considerations = mockedOrders.map(o => toReceivedItems(o.consideration));
      const fulfiller = constants.AddressZero;
      const secondOrderHash = when(arg => orderHashes[1] === arg);

      mockedIsCancelled.mockReturnValue(
        //@ts-ignore
        false,
      );

      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(secondOrderHash)
        //@ts-ignore
        .mockReturnValue(true);

      mockedFetchFlagged.mockReturnValue(
        //@ts-ignore
        Promise.resolve(new Set([`${considerations[2][0].token}:${considerations[2][0].identifier}`])),
      );

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders, considerations, fulfiller },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);

      const { orders, errors } = res._getJSONData();
      expect(orders.length).toEqual(1);
      expect(errors[0].error).toEqual("OrderCancelled");
      expect(errors[1].error).toEqual("FlaggedTokenInConsideration");

      //Only the first order does not have errors
      const order = orders[0];
      const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
      const context: BytesLike = hashConsideration(considerations[0]);
      const signer = recoverOrderSigner(fulfiller, decoded[2], orderHashes[0], context, decoded[3]);

      expect(signer).toBe(wallet.address);
      expect(mockedIsCancelled).toHaveBeenCalledWith(orderHashes[0]);
    });
  });
});
