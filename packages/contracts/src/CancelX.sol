// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ZoneInterface } from "./external/ZoneInterface.sol";
import { AdvancedOrder, CriteriaResolver } from "./external/ConsiderationStructs.sol";
import { EIP712, ECDSA } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

struct OrderValidity {
    uint256 blockDeadline;
    bytes32 orderHash;
}

contract CancelX is ZoneInterface, EIP712, Ownable {
    error CancelX__OrderValidityExpired();
    error CancelX__InvalidSigner();
    error CancelX__InvalidOrder();

    bytes32 public constant ORDER_VALIDITY_HASHTYPE =
        keccak256("OrderValidity(uint256 blockDeadline,bytes32 orderHash)");

    address public signer;

    constructor(
        string memory name,
        string memory version,
        address signer_
    ) EIP712(name, version) {
        signer = signer_;
    }

    function setSigner(address signer_) external onlyOwner {
        signer = signer_;
    }

    // Called by Consideration whenever extraData is not provided by the caller.
    function isValidOrder(
        bytes32,
        address,
        address,
        bytes32
    ) external pure returns (bytes4) {
        revert();
    }

    // Called by Consideration whenever any extraData is provided by the caller.
    function isValidOrderIncludingExtraData(
        bytes32 orderHash,
        address,
        AdvancedOrder calldata order,
        bytes32[] calldata,
        CriteriaResolver[] calldata
    ) external view returns (bytes4 validOrderMagicValue) {
        (OrderValidity memory orderValidity, bytes memory signature) = abi.decode(
            order.extraData,
            (OrderValidity, bytes)
        );
        if (orderHash != orderValidity.orderHash) revert CancelX__InvalidOrder();

        _validateOrderValidity(orderValidity, signature);
        validOrderMagicValue = ZoneInterface.isValidOrder.selector;
    }

    /// @dev Validates if a mint token is valid
    function _validateOrderValidity(OrderValidity memory orderValidity, bytes memory signature) internal view {
        uint256 blockDeadline = orderValidity.blockDeadline;
        if (block.number > blockDeadline) revert CancelX__OrderValidityExpired();
        bytes32 orderValidityHash = _hashOrderValidity(blockDeadline, orderValidity.orderHash);
        if (!_verifySigner(orderValidityHash, signature)) revert CancelX__InvalidSigner();
    }

    /// @dev Calculates order validity hash
    function _hashOrderValidity(uint256 blockDeadline, bytes32 orderHash) internal view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(ORDER_VALIDITY_HASHTYPE, blockDeadline, orderHash)));
    }

    /// @dev Verifies the signer is approved
    function _verifySigner(bytes32 digest, bytes memory signature) internal view returns (bool) {
        return signer == ECDSA.recover(digest, signature);
    }
}
