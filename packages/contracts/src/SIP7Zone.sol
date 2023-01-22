// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ZoneInterface } from "./external/ZoneInterface.sol";
import { SIP7Interface } from "./external/SIP7Interface.sol";
import { SIP5Interface } from "./external/SIP5Interface.sol";
import { AdvancedOrder, CriteriaResolver, ZoneParameters, Schema } from "./external/ConsiderationStructs.sol";
import { EIP712, ECDSA } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract SIP7Zone is ZoneInterface, EIP712, Ownable, SIP7Interface, SIP5Interface {
    enum SignerStatus {
        NEW,
        AUTHORIZED,
        REMOVED
    }

    error SignatureExpired(uint256 currentTimestamp, uint256 expiration, bytes32 orderHash);
    error SignerNotApproved(address signer, bytes32 orderHash);
    error SignerAlreadyAdded(address signer);
    error SignerCannotBeReauthorized();
    error SignerNotActive(address signer);

    error InvalidFulfiller(address fulfiller, address caller, bytes32 orderHash);

    error MissingExtraData();
    error InvalidExtraData();

    event SignerAdded(address signer);
    event SignerRemoved(address signer);

    bytes32 public constant ORDER_VALIDITY_HASHTYPE =
        // prettier-ignore
        keccak256(
            abi.encodePacked(
              "SignedOrder("
                  "address fulfiller,"
                  "uint64 expiration,"
                  "bytes32 orderHash,"
                  "bytes context"
              ")"
            )
        );

    mapping(address => SignerStatus) public signerStatus;
    string private _sip7APIEndpoint;
    string private _zoneName;

    constructor(
        string memory name,
        string memory version,
        string memory sip7APIEndpoint
    ) EIP712(name, version) {
        _zoneName = name;
        _sip7APIEndpoint = sip7APIEndpoint;
    }

    function addSigner(address signer) external onlyOwner {
        SignerStatus status = signerStatus[signer];
        if (status == SignerStatus.NEW) {
            signerStatus[signer] = SignerStatus.AUTHORIZED;
            emit SignerAdded(signer);
        } else if (status == SignerStatus.AUTHORIZED) {
            revert SignerAlreadyAdded(signer);
        } else {
            revert SignerCannotBeReauthorized();
        }
    }

    function removeSigner(address signer) external onlyOwner {
        SignerStatus status = signerStatus[signer];
        if (status == SignerStatus.AUTHORIZED) {
            signerStatus[signer] = SignerStatus.REMOVED;
            emit SignerRemoved(signer);
        } else {
            revert SignerNotActive(signer);
        }
    }

    /**
     * @notice Update the API endpoint returned by this zone.
     *
     * @param newApiEndpoint The new API endpoint.
     */
    function updateAPIEndpoint(string calldata newApiEndpoint) external onlyOwner {
        // Update to the new API endpoint.
        _sip7APIEndpoint = newApiEndpoint;
    }

    // Called by Consideration whenever any extraData is provided by the caller.
    function validateOrder(ZoneParameters calldata zoneParameters) external view returns (bytes4 validOrderMagicValue) {
        if (zoneParameters.extraData.length < 1) revert MissingExtraData();
        if (zoneParameters.extraData.length < 92) revert InvalidExtraData();
        (bytes1 version, address fulfiller, uint64 expiration, bytes memory signature, bytes memory context) = abi
            .decode(zoneParameters.extraData, (bytes1, address, uint64, bytes, bytes));
        if (version != 0 || signature.length != 64) revert InvalidExtraData();
        if (fulfiller != address(0) && fulfiller != zoneParameters.fulfiller)
            revert InvalidFulfiller(fulfiller, zoneParameters.fulfiller, zoneParameters.orderHash);

        _validateSignedOrder(fulfiller, expiration, zoneParameters.orderHash, context, signature);
        if (context.length > 0) {
            _validateContext(zoneParameters, context);
        }
        validOrderMagicValue = ZoneInterface.validateOrder.selector;
    }

    function _validateContext(ZoneParameters calldata zoneParameters, bytes memory context) internal view virtual {}

    function _validateSignedOrder(
        address fulfiller,
        uint256 expiration,
        bytes32 orderHash,
        bytes memory context,
        bytes memory signature
    ) internal view {
        if (block.timestamp > expiration) revert SignatureExpired(block.timestamp, expiration, orderHash);

        bytes32 signedOrderHash = _hashSignedOrder(fulfiller, expiration, orderHash, context);
        (bytes32 r, bytes32 vs) = abi.decode(signature, (bytes32, bytes32));
        address recoveredSigner = ECDSA.recover(signedOrderHash, r, vs);

        if (signerStatus[recoveredSigner] != SignerStatus.AUTHORIZED)
            revert SignerNotApproved(recoveredSigner, orderHash);
    }

    function _hashSignedOrder(
        address fulfiller,
        uint256 expiration,
        bytes32 orderHash,
        bytes memory context
    ) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(abi.encode(ORDER_VALIDITY_HASHTYPE, fulfiller, expiration, orderHash, keccak256(context)))
            );
    }

    /**
     * @notice Returns signing information about the zone.
     *
     * @return domainSeparator The domain separator used for signing.
     */
    function sip7Information() external view returns (bytes32 domainSeparator, string memory apiEndpoint) {
        // Derive the domain separator.
        domainSeparator = _domainSeparatorV4();

        // Return the API endpoint.
        apiEndpoint = _sip7APIEndpoint;
    }

    /**
     * @dev Returns Seaport metadata for this contract, returning the
     *      contract name and supported schemas.
     *
     * @return name    The contract name
     * @return schemas The supported SIPs
     */
    function getSeaportMetadata() external view returns (string memory name, Schema[] memory schemas) {
        name = _zoneName;
        schemas = new Schema[](1);
        schemas[0].id = 7;
    }
}
