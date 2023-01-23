import { cancelOrder } from "../../src/features/cancellation";
import * as mongo from "../../src/persistence/mongodb";
import * as time from "../../src/utils/time";

jest.mock("../../src/utils/time", () => ({
  getTimestamp: jest.fn(),
}));

jest.mock("../../src/persistence/mongodb", () => ({
  getSignatureTrackingExpiration: jest.fn(),
  insertCancellation: jest.fn(),
}));

const mockedGetTimestamp = time.getTimestamp as unknown as jest.Mock<typeof time.getTimestamp>;
const mockedGetSignatureTrackingExpiration = mongo.getSignatureTrackingExpiration as unknown as jest.Mock<
  typeof mongo.getSignatureTrackingExpiration
>;
const mockedInsertCancellation = mongo.insertCancellation as unknown as jest.Mock<typeof mongo.insertCancellation>;

describe("cancelOrder", () => {
  afterEach(() => {
    mockedGetTimestamp.mockRestore();
    mockedGetSignatureTrackingExpiration.mockRestore();
    mockedInsertCancellation.mockRestore();
  });

  it("should call insertCancellation with current timestamp if signatures expired", async () => {
    //@ts-ignore
    mockedGetTimestamp.mockReturnValue(100);
    //@ts-ignore
    mockedGetSignatureTrackingExpiration.mockReturnValue(Promise.resolve(50));
    const owner = "owner1";
    const orderHash = "order1";
    const timestamp = await cancelOrder(owner, orderHash);
    expect(mockedInsertCancellation).toHaveBeenCalledWith({ orderHash, owner, timestamp: 100 });
  });

  it("should call insertCancellation with future timestamp if signatures not expired", async () => {
    //@ts-ignore
    mockedGetTimestamp.mockReturnValue(100);
    //@ts-ignore
    mockedGetSignatureTrackingExpiration.mockReturnValue(Promise.resolve(150));
    const owner = "owner1";
    const orderHash = "order1";
    const timestamp = await cancelOrder(owner, orderHash);
    expect(mockedInsertCancellation).toHaveBeenCalledWith({ orderHash, owner, timestamp: 150 });
  });
});
