// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ZoneParameters, ReceivedItem } from "./external/ConsiderationStructs.sol";
import { ZoneInterface } from "./external/ZoneInterface.sol";
import { AdvancedOrder, CriteriaResolver } from "./external/ConsiderationStructs.sol";
import { EIP712, ECDSA } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SIP7Zone } from "./SIP7Zone.sol";

/**
 * @title  Breakwater Zone
 * @author Tony Snark
 * @notice Custom SIP7 zone which validates received items
 */
contract Breakwater is SIP7Zone {
    error InvalidConsideration();
    error InvalidContext();

    bytes public constant CONSIDERATION_BYTES =
        // prettier-ignore
        abi.encodePacked(
              "Consideration(",
                  "ReceivedItem[] consideration",
              ")"
        );

    bytes public constant RECEIVED_ITEM_BYTES =
        // prettier-ignore
        abi.encodePacked(
              "ReceivedItem(",
                  "uint8 itemType,",
                  "address token,",
                  "uint256 identifier,",
                  "uint256 amount,",
                  "address recipient",
              ")"
        );

    bytes32 public constant RECEIVED_ITEM_HASHTYPE = keccak256(RECEIVED_ITEM_BYTES);
    bytes32 public constant CONSIDERATION_HASHTYPE =
        keccak256(abi.encodePacked(CONSIDERATION_BYTES, RECEIVED_ITEM_BYTES));

    constructor(
        string memory name,
        string memory version,
        string memory sip7APIEndpoint
    ) SIP7Zone(name, version, sip7APIEndpoint) {}

    /**
     * @dev This function validates the context by making sure it contains
     *      the EIP712 hash of the array of received items.
     */
    function _validateContext(ZoneParameters calldata zoneParameters, bytes memory context)
        internal
        view
        virtual
        override
    {
        if (context.length != 32) revert InvalidContext();
        bytes32 considerationHash = bytes32(context);
        if (_hashConsideration(zoneParameters.consideration) != considerationHash) revert InvalidConsideration();
    }

    /// @dev Calculates consideration hash
    function _hashConsideration(ReceivedItem[] memory consideration) internal pure returns (bytes32) {
        uint256 numberOfItems = consideration.length;
        bytes32[] memory considerationHashes = new bytes32[](numberOfItems);
        for (uint256 i; i < numberOfItems; ) {
            considerationHashes[i] = _hashReceivedItem(consideration[i]);
            unchecked {
                ++i;
            }
        }
        return keccak256(abi.encode(CONSIDERATION_HASHTYPE, keccak256(abi.encodePacked(considerationHashes))));
    }

    /// @dev Calculates consideration item hash
    function _hashReceivedItem(ReceivedItem memory receivedItem) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    RECEIVED_ITEM_HASHTYPE,
                    receivedItem.itemType,
                    receivedItem.token,
                    receivedItem.identifier,
                    receivedItem.amount,
                    receivedItem.recipient
                )
            );
    }
}
