import { expect } from "chai";
import { constants, utils, Wallet } from "ethers";
import { BytesLike, keccak256, _TypedDataEncoder } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { ReceivedItemStruct, ZoneParametersStruct } from "../../typechain/src/Breakwater";
import { Contracts, setupContracts, User } from "../fixtures/contracts";
import {
  advanceBlockBySeconds,
  autoMining,
  CONSIDERATION_EIP712_TYPE,
  convertSignatureToEIP2098,
  EIP712_DOMAIN,
  getCurrentTimeStamp,
  SIGNED_ORDER_EIP712_TYPE,
} from "../utils";

describe("Breakwater", function () {
  let deployer: User;
  let users: User[];
  let contracts: Contracts;

  beforeEach(async () => {
    await autoMining();
    ({ deployer, users, contracts } = await setupContracts());
  });

  describe("ACL", async function () {
    it("sets deployers as owner", async function () {
      expect((await deployer.Breakwater.owner()) === deployer.address);
    });

    it("forbids non owner to set owner", async function () {
      await expect(users[1].Breakwater.transferOwnership(users[2].address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("forbids non owner to authorize signer", async function () {
      await expect(users[1].Breakwater.addSigner(users[2].address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("forbids non owner to deauthorize signer", async function () {
      await expect(users[1].Breakwater.removeSigner(users[2].address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("forbids non owner to update api endpoint", async function () {
      await expect(users[1].Breakwater.updateAPIEndpoint("google.com")).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });
  });

  describe("Signers", async function () {
    it("allows owner to authorize signer", async function () {
      await expect(deployer.Breakwater.addSigner(users[8].address))
        .to.emit(contracts.Breakwater, "SignerAdded")
        .withArgs(users[8].address);
      expect(await deployer.Breakwater.getActiveSigners()).to.contain(users[8].address);
    });

    it("reverts when adding signer twice", async function () {
      await deployer.Breakwater.addSigner(users[8].address);
      await expect(deployer.Breakwater.addSigner(users[8].address)).to.be.revertedWithCustomError(
        contracts.Breakwater,
        "SignerAlreadyAdded",
      );
    });

    it("reverts when adding removed signer", async function () {
      await deployer.Breakwater.addSigner(users[8].address);
      await deployer.Breakwater.removeSigner(users[8].address);
      await expect(deployer.Breakwater.addSigner(users[8].address)).to.be.revertedWithCustomError(
        contracts.Breakwater,
        "SignerCannotBeReauthorized",
      );
    });

    it("allows owner to deauthorize signer", async function () {
      await deployer.Breakwater.addSigner(users[8].address);
      await expect(deployer.Breakwater.removeSigner(users[8].address))
        .to.emit(contracts.Breakwater, "SignerRemoved")
        .withArgs(users[8].address);
      expect(await deployer.Breakwater.getActiveSigners()).to.be.empty;
    });

    it("reverts when removing new signer", async function () {
      await expect(deployer.Breakwater.removeSigner(users[8].address)).to.be.revertedWithCustomError(
        contracts.Breakwater,
        "SignerNotPresent",
      );
    });

    it("reverts when removing removed signer", async function () {
      await deployer.Breakwater.addSigner(users[8].address);
      await deployer.Breakwater.removeSigner(users[8].address);
      await expect(deployer.Breakwater.removeSigner(users[8].address)).to.be.revertedWithCustomError(
        contracts.Breakwater,
        "SignerNotPresent",
      );
    });
  });

  describe("Order Validation", async function () {
    let signer: Wallet;

    beforeEach(async () => {
      signer = ethers.Wallet.createRandom();
      await deployer.Breakwater.addSigner(signer.address);
    });

    it("reverts without extra data", async function () {
      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(keccak256("0x1234"), constants.AddressZero, [])),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "InvalidExtraData");
    });

    it("reverts with small extra data", async function () {
      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(keccak256("0x1234"), constants.AddressZero, [1, 2])),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "InvalidExtraData");
    });

    it("reverts with invalid fulfiller", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = (await getCurrentTimeStamp()) + 100;
      const fulfiller = Wallet.createRandom().address;
      const context = constants.HashZero;
      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
      );

      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(orderHash, constants.AddressZero, extraData)),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "InvalidFulfiller");
    });

    it("reverts when validity expired", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = await getCurrentTimeStamp();
      const fulfiller = constants.AddressZero;
      const context = constants.HashZero;
      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
      );

      await advanceBlockBySeconds(100);

      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(orderHash, constants.AddressZero, extraData)),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "SignatureExpired");
    });

    it("reverts when signer not correct", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = (await getCurrentTimeStamp()) + 100;
      const fulfiller = constants.AddressZero;
      const context = constants.HashZero;
      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await deployer.signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
      );

      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(orderHash, constants.AddressZero, extraData)),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "SignerNotActive");
    });

    it("reverts with invalid signature format", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = (await getCurrentTimeStamp()) + 100;
      const fulfiller = constants.AddressZero;
      const context = constants.HashZero;
      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [0, fulfiller, expiration, signature.substring(0, 62), context],
      );

      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(orderHash, constants.AddressZero, extraData)),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "InvalidExtraData");
    });

    it("reverts with invalid SIP06 version", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = (await getCurrentTimeStamp()) + 100;
      const fulfiller = constants.AddressZero;
      const context = constants.HashZero;
      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [1, fulfiller, expiration, signature, context],
      );

      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(orderHash, constants.AddressZero, extraData)),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "InvalidExtraDataEncoding");
    });

    it("reverts without context", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = (await getCurrentTimeStamp()) + 100;
      const fulfiller = constants.AddressZero;
      const context: BytesLike = [];
      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
      );

      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(orderHash, constants.AddressZero, extraData)),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "InvalidContext");
    });

    it("validates correct signature with context", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = (await getCurrentTimeStamp()) + 100;
      const fulfiller = constants.AddressZero;
      const consideration = mockConsideration();
      const considerationHash = _TypedDataEncoder.hashStruct("Consideration", CONSIDERATION_EIP712_TYPE, {
        consideration,
      });

      const context: BytesLike = utils.solidityPack(["bytes1", "bytes"], [0, considerationHash]);

      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
      );

      expect(
        await contracts.Breakwater.validateOrder(
          mockZoneParameter(orderHash, constants.AddressZero, extraData, consideration),
        ),
      ).to.be.equal("0x17b1f942"); // ZoneInterface.validateOrder.selector
    });

    it("reverts with wrong SIP6 version for context", async function () {
      const orderHash = keccak256("0x1234");
      const expiration = (await getCurrentTimeStamp()) + 100;
      const fulfiller = constants.AddressZero;
      const consideration = mockConsideration();
      const considerationHash = _TypedDataEncoder.hashStruct("Consideration", CONSIDERATION_EIP712_TYPE, {
        consideration,
      });

      const context: BytesLike = utils.solidityPack(["bytes1", "bytes"], [2, considerationHash]);

      const signedOrder = {
        fulfiller,
        expiration,
        orderHash,
        context,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.Breakwater.address),
        SIGNED_ORDER_EIP712_TYPE,
        signedOrder,
      );

      const extraData = utils.solidityPack(
        ["bytes1", "address", "uint64", "bytes", "bytes"],
        [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
      );

      await expect(
        contracts.Breakwater.validateOrder(mockZoneParameter(orderHash, constants.AddressZero, extraData)),
      ).to.be.revertedWithCustomError(contracts.Breakwater, "InvalidExtraDataEncoding");
    });
  });
});

function mockConsideration(howMany: number = 10): ReceivedItemStruct[] {
  const consideration = [];
  for (let i = 0; i < howMany; i++) {
    consideration.push({
      itemType: 0,
      token: Wallet.createRandom().address,
      identifier: 123,
      amount: 12,
      recipient: Wallet.createRandom().address,
    });
  }

  return consideration;
}

function mockZoneParameter(
  orderHash: string,
  fulfiller: string,
  extraData: BytesLike,
  consideration: ReceivedItemStruct[] = [],
): ZoneParametersStruct {
  return {
    orderHash,
    fulfiller,
    offerer: constants.AddressZero,
    offer: [],
    consideration,
    extraData,
    orderHashes: [],
    startTime: 0,
    endTime: 0,
    zoneHash: constants.HashZero,
  };
}
