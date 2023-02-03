// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ZoneParameters, ReceivedItem } from "./external/ConsiderationStructs.sol";
import { SignedZone } from "./external/SignedZone.sol";

/**
 * @title  Breakwater Zone
 * @author Tony Snark
 * @notice Custom SIP7 zone which validates received items
 */
contract Breakwater is SignedZone {
    /**
     * @dev Revert with an error if consideration does not match the hash provided.
     */
    error InvalidConsideration();
    /**
     * @dev Revert with an error if the context does not adhere to the standard format.
     */
    error InvalidContext();

    uint256[] _SUPPORTED_SUBSTANDARDS = [7];

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
        string memory sip7APIEndpoint,
        string memory documentationURI
    ) SignedZone(name, version, sip7APIEndpoint, _SUPPORTED_SUBSTANDARDS, documentationURI) {}

    ///@inheritdoc SignedZone
    function validateOrder(ZoneParameters calldata zoneParameters)
        public
        view
        override
        returns (bytes4 validOrderMagicValue)
    {
        validOrderMagicValue = super.validateOrder(zoneParameters);
        bytes calldata extraData = zoneParameters.extraData;
        // extraData bytes 94-126: Received Items Hash
        if (extraData.length != 126) revert InvalidContext();
        // extraData bytes 93-94: SIP-6 version byte (MUST be 0x00)
        if (extraData[93] != 0x00) {
            revert InvalidExtraDataEncoding(0x00);
        }
        bytes calldata contextPayload = extraData[94:];

        bytes32 considerationHash = bytes32(contextPayload);
        if (_hashConsideration(zoneParameters.consideration) != considerationHash) revert InvalidConsideration();
    }

    /// @dev Calculates consideration hash
    function _hashConsideration(ReceivedItem[] calldata consideration) internal pure returns (bytes32) {
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
    function _hashReceivedItem(ReceivedItem calldata receivedItem) internal pure returns (bytes32) {
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
