import { BytesLike, defaultAbiCoder } from "ethers/lib/utils";
import { when } from "jest-when";
import { createMocks } from "node-mocks-http";
import { hashConsideration, recoverOrderSigner } from "../../src/eip712";
import { wallet } from "../../src/eth";
import handler from "../../src/pages/api/signatures";
import * as mongo from "../../src/persistence/mongodb";
import * as reservoir from "../../src/reservoir";
import { mockOrderSignatureRequest } from "../utils/mocks";

jest.mock("../../src/reservoir", () => ({
  fetchFlagged: jest.fn(),
}));

jest.mock("../../src/persistence/mongodb", () => ({
  trackSignature: jest.fn(),
  findCancellations: jest.fn(),
  isCancelled: jest.fn(),
  insertCancellation: jest.fn(),
}));

const mockedFetchFlagged = reservoir.fetchFlagged as unknown as jest.Mock<typeof reservoir.fetchFlagged>;
const mockedTrackSignature = mongo.trackSignature as unknown as jest.Mock<typeof mongo.trackSignature>;
const mockedGetCancellations = mongo.findCancellations as unknown as jest.Mock<typeof mongo.findCancellations>;
const mockedIsCancelled = mongo.isCancelled as unknown as jest.Mock<typeof mongo.isCancelled>;
const mockedInsertCancellation = mongo.insertCancellation as unknown as jest.Mock<typeof mongo.insertCancellation>;
const chainId = parseFloat(process.env.NEXT_PUBLIC_CHAIN_ID ?? "1");

describe("Sign Order API", () => {
  afterEach(() => {
    mockedFetchFlagged.mockRestore();
    mockedTrackSignature.mockRestore();
    mockedGetCancellations.mockRestore();
    mockedIsCancelled.mockRestore();
    mockedInsertCancellation.mockRestore();
  });

  describe("/api/signatures", () => {
    it("returns signature for non cancelled single order", async () => {
      const mockedOrders = await mockOrderSignatureRequest(1);
      const { fulfiller, orderHash, consideration } = mockedOrders[0];

      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(orderHash)
        //@ts-ignore
        .mockReturnValue(false);

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const { orders } = res._getJSONData();

      const order = orders[0];
      const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);

      const context: BytesLike = hashConsideration(consideration);
      const signer = recoverOrderSigner(fulfiller, decoded[2], orderHash, context, decoded[3]);

      expect(signer).toBe(wallet.address);
      expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
      expect(mockedTrackSignature).toHaveBeenCalledWith({ orderHash: order.orderHash, expiration: order.expiration });
    });

    it("returns signature for non cancelled multiple orders", async () => {
      const batchSize = 3;
      const mockedOrders = await mockOrderSignatureRequest(3);

      //@ts-ignore
      mockedIsCancelled.mockReturnValue(false);

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const { orders } = res._getJSONData();

      expect(orders.length).toBe(batchSize);

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const { fulfiller, orderHash, consideration } = mockedOrders[i];
        const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
        const context: BytesLike = hashConsideration(consideration);
        const signer = recoverOrderSigner(fulfiller, decoded[2], orderHash, context, decoded[3]);

        expect(signer).toBe(wallet.address);
        expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
        expect(mockedTrackSignature).toHaveBeenCalledWith({
          orderHash,
          expiration: order.expiration,
        });
      }
    });

    it("returns error if token flagged on single order", async () => {
      const mockedOrders = await mockOrderSignatureRequest(1, true);
      const { orderHash, consideration } = mockedOrders[0];
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
        body: { orders: mockedOrders },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const { orders } = res._getJSONData();
      expect(orders[0].error).toEqual("FlaggedTokenInConsideration");
    });

    it("returns signatures and errors when some orders are flagged", async () => {
      const batchSize = 3;
      const mockedOrders = await mockOrderSignatureRequest(batchSize, true);

      //@ts-ignore
      mockedIsCancelled.mockReturnValue(false);

      mockedFetchFlagged.mockReturnValue(
        //@ts-ignore
        Promise.resolve(
          new Set([`${mockedOrders[2].consideration[0].token}:${mockedOrders[2].consideration[0].identifier}`]),
        ),
      );
      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const { orders } = res._getJSONData();

      expect(orders[2].error).toEqual("FlaggedTokenInConsideration");
      //The last order of the batch is removed
      for (let i = 0; i < orders.length - 1; i++) {
        const order = orders[i];
        const { fulfiller, orderHash, consideration } = mockedOrders[i];
        const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
        const context: BytesLike = hashConsideration(consideration);
        const signer = recoverOrderSigner(fulfiller, decoded[2], orderHash, context, decoded[3]);

        expect(signer).toBe(wallet.address);
        expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
      }
    });

    it("returns error if order is cancelled on single order", async () => {
      const mockedOrders = await mockOrderSignatureRequest(1);
      const { orderHash } = mockedOrders[0];
      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(orderHash)
        //@ts-ignore
        .mockReturnValue(true);

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const { orders } = res._getJSONData();

      expect(orders[0].error).toEqual("SignaturesNoLongerVended");
    });

    it("returns signatures and errors when some orders are cancelled", async () => {
      const batchSize = 3;
      const mockedOrders = await mockOrderSignatureRequest(batchSize);
      const lastOrderHash = when(arg => mockedOrders[2].orderHash === arg);

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
        body: { orders: mockedOrders },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const { orders } = res._getJSONData();

      expect(orders[2].error).toEqual("SignaturesNoLongerVended");
      //The last order of the batch is removed
      for (let i = 0; i < orders.length - 1; i++) {
        const order = orders[i];
        const { fulfiller, orderHash, consideration } = mockedOrders[i];
        const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
        const context: BytesLike = hashConsideration(consideration);
        const signer = recoverOrderSigner(fulfiller, decoded[2], orderHash, context, decoded[3]);

        expect(signer).toBe(wallet.address);
        expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
      }
    });

    it("returns signatures and errors when some orders are cancelled and flagged", async () => {
      const batchSize = 3;
      const mockedOrders = await mockOrderSignatureRequest(batchSize, true);
      const secondOrderHash = when(arg => mockedOrders[1].orderHash === arg);

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
        Promise.resolve(
          new Set([`${mockedOrders[2].consideration[0].token}:${mockedOrders[2].consideration[0].identifier}`]),
        ),
      );

      const { req, res } = createMocks({
        method: "POST",
        body: { orders: mockedOrders },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);

      const { orders } = res._getJSONData();
      expect(orders[1].error).toEqual("SignaturesNoLongerVended");
      expect(orders[2].error).toEqual("FlaggedTokenInConsideration");

      //Only the first order does not have errors
      const order = orders[0];
      const { fulfiller, orderHash, consideration } = mockedOrders[0];
      const decoded = defaultAbiCoder.decode(["bytes1", "address", "uint64", "bytes", "bytes"], order.extraData);
      const context: BytesLike = hashConsideration(consideration);
      const signer = recoverOrderSigner(fulfiller, decoded[2], orderHash, context, decoded[3]);

      expect(signer).toBe(wallet.address);
      expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
    });
  });
});
