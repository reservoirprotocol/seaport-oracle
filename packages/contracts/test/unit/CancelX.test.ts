import { expect } from "chai";
import { constants, Wallet } from "ethers";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { AdvancedOrderStruct } from "../../typechain/CancelX";
import { Contracts, setupContracts, User } from "../fixtures/contracts";
import { autoMining, EIP712_DOMAIN, getCurrentBlockNumber, mineBlocks, ORDER_VALIDITY_EIP712_TYPE } from "../utils";

describe("CancelX", function () {
  let deployer: User;
  let users: User[];
  let contracts: Contracts;

  beforeEach(async () => {
    await autoMining();
    ({ deployer, users, contracts } = await setupContracts());
  });

  describe("ACL", async function () {
    it("sets deployers as owner", async function () {
      expect((await deployer.CancelX.owner()) === deployer.address);
    });

    it("allows owner to set signer", async function () {
      await deployer.CancelX.setSigner(users[8].address);
      //@ts-ignore
      expect((await deployer.CancelX["signer()"]) === users[8].address);
    });

    it("forbids non owner to set owner", async function () {
      await expect(users[1].CancelX.transferOwnership(users[2].address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("forbids non owner to set signer", async function () {
      await expect(users[1].CancelX.setSigner(users[2].address)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Order Validation", async function () {
    let signer: Wallet;

    beforeEach(async () => {
      signer = ethers.Wallet.createRandom();
      await deployer.CancelX.setSigner(signer.address);
    });

    it("reverts without extra data", async function () {
      await expect(
        users[1].CancelX.isValidOrder(
          constants.HashZero,
          constants.AddressZero,
          constants.AddressZero,
          constants.HashZero,
        ),
      ).to.be.reverted;
    });

    it("reverts when signed order hash not order hash argument", async function () {
      const orderHash = keccak256("0x1234");
      const signedOrderHash = keccak256("0x1235");
      const blockDeadline = (await getCurrentBlockNumber()) + 10;

      const orderValidity = {
        blockDeadline,
        orderHash: signedOrderHash,
      };
      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.CancelX.address),
        ORDER_VALIDITY_EIP712_TYPE,
        orderValidity,
      );

      const extraData = defaultAbiCoder.encode(
        ["tuple(uint256, bytes32)", "bytes"],
        [[orderValidity.blockDeadline, orderValidity.orderHash], signature],
      );

      await expect(
        contracts.CancelX.isValidOrderIncludingExtraData(
          orderHash,
          constants.AddressZero,
          mockOrderWithExtraData(extraData),
          [],
          [],
        ),
      ).to.be.revertedWithCustomError(contracts.CancelX, "CancelX__InvalidOrder");
    });

    it("reverts when validity expired", async function () {
      const orderHash = keccak256("0x1234");
      const blockDeadline = (await getCurrentBlockNumber()) + 10;

      await mineBlocks();

      const orderValidity = {
        blockDeadline,
        orderHash,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.CancelX.address),
        ORDER_VALIDITY_EIP712_TYPE,
        orderValidity,
      );

      const extraData = defaultAbiCoder.encode(
        ["tuple(uint256, bytes32)", "bytes"],
        [[orderValidity.blockDeadline, orderValidity.orderHash], signature],
      );

      await expect(
        contracts.CancelX.isValidOrderIncludingExtraData(
          orderHash,
          constants.AddressZero,
          mockOrderWithExtraData(extraData),
          [],
          [],
        ),
      ).to.be.revertedWithCustomError(contracts.CancelX, "CancelX__OrderValidityExpired");
    });

    it("reverts when signer not correct", async function () {
      const orderHash = keccak256("0x1234");
      const blockDeadline = (await getCurrentBlockNumber()) + 10;

      const orderValidity = {
        blockDeadline,
        orderHash,
      };

      const signature = await deployer.signer._signTypedData(
        EIP712_DOMAIN(1, contracts.CancelX.address),
        ORDER_VALIDITY_EIP712_TYPE,
        orderValidity,
      );

      const extraData = defaultAbiCoder.encode(
        ["tuple(uint256, bytes32)", "bytes"],
        [[orderValidity.blockDeadline, orderValidity.orderHash], signature],
      );

      await expect(
        contracts.CancelX.isValidOrderIncludingExtraData(
          orderHash,
          constants.AddressZero,
          mockOrderWithExtraData(extraData),
          [],
          [],
        ),
      ).to.be.revertedWithCustomError(contracts.CancelX, "CancelX__InvalidSigner");
    });

    it("validates correct signature", async function () {
      const orderHash = keccak256("0x1234");
      const blockDeadline = (await getCurrentBlockNumber()) + 10;

      const orderValidity = {
        blockDeadline,
        orderHash,
      };

      const signature = await signer._signTypedData(
        EIP712_DOMAIN(1, contracts.CancelX.address),
        ORDER_VALIDITY_EIP712_TYPE,
        orderValidity,
      );

      const extraData = defaultAbiCoder.encode(
        ["tuple(uint256, bytes32)", "bytes"],
        [[orderValidity.blockDeadline, orderValidity.orderHash], signature],
      );

      expect(
        await contracts.CancelX.isValidOrderIncludingExtraData(
          orderHash,
          constants.AddressZero,
          mockOrderWithExtraData(extraData),
          [],
          [],
        ),
      ).to.be.equal("0x0e1d31dc"); // ZoneInterface.isValidOrder.selector
    });
  });
});

function mockOrderWithExtraData(extraData: string): AdvancedOrderStruct {
  return {
    parameters: {
      offerer: constants.AddressZero,
      zone: constants.AddressZero,
      offer: [],
      consideration: [],
      orderType: 0,
      startTime: 0,
      endTime: 0,
      zoneHash: constants.HashZero,
      salt: 0,
      conduitKey: constants.HashZero,
      totalOriginalConsiderationItems: 0,
    },
    numerator: 0,
    denominator: 0,
    signature: constants.HashZero,
    extraData,
  };
}
