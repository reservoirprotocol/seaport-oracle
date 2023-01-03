import { defaultAbiCoder, keccak256, verifyTypedData } from "ethers/lib/utils";
import { when } from "jest-when";
import { createMocks } from "node-mocks-http";
import { wallet } from "../../src/eth";
import handler from "../../src/pages/api/sign/[orderHash]";
import * as mongo from "../../src/persistence/mongodb";
import { EIP712_DOMAIN, ORDER_VALIDITY_EIP712_TYPE } from "../../src/types/types";
import { MAX_BLOCKS_VALITIDY } from "../../src/utils/constants";

jest.mock("../../src/persistence/mongodb", () => ({
  findCancellations: jest.fn(),
  isCancelled: jest.fn(),
  insertCancellation: jest.fn(),
}));

const mockedGetCancellations = mongo.findCancellations as unknown as jest.Mock<typeof mongo.findCancellations>;
const mockedIsCancelled = mongo.isCancelled as unknown as jest.Mock<typeof mongo.isCancelled>;
const mockedInsertCancellation = mongo.insertCancellation as unknown as jest.Mock<typeof mongo.insertCancellation>;
const chainId = parseFloat(process.env.NEXT_PUBLIC_CHAIN_ID ?? "1");

describe("Sign Order API", () => {
  afterEach(() => {
    mockedGetCancellations.mockRestore();
    mockedIsCancelled.mockRestore();
    mockedInsertCancellation.mockRestore();
  });

  describe("/api/sign", () => {
    it("returns signature for non cancelled order hash", async () => {
      const orderHash = keccak256("0x1234");
      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(orderHash)
        //@ts-ignore
        .mockReturnValue(false);

      const { req, res } = createMocks({
        method: "GET",
        query: { orderHash },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);

      const { orderHash: returnedOrderHash, extraData, blockDeadline, blockNumber } = res._getJSONData();
      const decoded = defaultAbiCoder.decode(["tuple(uint256, bytes32)", "bytes"], extraData);

      const signer = verifyTypedData(
        EIP712_DOMAIN(chainId),
        ORDER_VALIDITY_EIP712_TYPE,
        {
          blockDeadline: blockNumber + MAX_BLOCKS_VALITIDY,
          orderHash,
        },
        decoded[1],
      );

      expect(blockDeadline).toBe(blockNumber + MAX_BLOCKS_VALITIDY);
      expect(returnedOrderHash).toBe(orderHash);
      expect(signer).toBe(wallet.address);
      expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
    });

    it("returns 409 for cancelled order hash", async () => {
      const orderHash = keccak256("0x1234");
      //@ts-ignore
      when(mockedIsCancelled)
        .calledWith(orderHash)
        //@ts-ignore
        .mockReturnValue(true);

      const { req, res } = createMocks({
        method: "GET",
        query: { orderHash },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(mockedIsCancelled).toHaveBeenCalledWith(orderHash);
    });
  });
});
