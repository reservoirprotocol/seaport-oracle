import { ItemType } from "@reservoir0x/sdk/dist/seaport/types";
import { FlaggingChecker } from "../../src/features/flagging/FlaggingChecker";
import * as reservoir from "../../src/reservoir/";

jest.mock("../../src/reservoir", () => ({
  fetchFlagged: jest.fn(),
}));

const mockedFetchFlagged = reservoir.fetchFlagged as unknown as jest.Mock<typeof reservoir.fetchFlagged>;

describe("FlaggingChecker", () => {
  afterEach(() => {
    mockedFetchFlagged.mockRestore();
  });

  it("should return true if any token is flagged", async () => {
    //@ts-ignore
    mockedFetchFlagged.mockReturnValue(Promise.resolve(new Set(["token1:id1", "token2:id3"])));
    const considerations = [
      [{ itemType: ItemType.ERC20, token: "token1", identifier: "id1", amount: "1", recipient: "recipient1" }],
      [{ itemType: ItemType.ERC721, token: "token2", identifier: "id2", amount: "1", recipient: "recipient2" }],
    ];
    const checker = new FlaggingChecker(considerations);
    const result = await checker.containsFlagged(considerations[0]);
    expect(result).toBe(true);
    expect(mockedFetchFlagged).toHaveBeenCalledWith(["token1:id1", "token2:id2"]);
  });

  it("should return false if no token is flagged", async () => {
    //@ts-ignore
    mockedFetchFlagged.mockReturnValue(Promise.resolve(new Set(["token1:id4", "token3:id2"])));
    const considerations = [
      [{ itemType: ItemType.ERC20, token: "token1", identifier: "id1", amount: "1", recipient: "recipient1" }],
      [{ itemType: ItemType.ERC721, token: "token2", identifier: "id2", amount: "1", recipient: "recipient2" }],
    ];
    const checker = new FlaggingChecker(considerations);
    const result = await checker.containsFlagged(considerations[0]);
    expect(result).toBe(false);
    expect(mockedFetchFlagged).toHaveBeenCalledWith(["token1:id1", "token2:id2"]);
  });
});
