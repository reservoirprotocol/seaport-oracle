// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ZoneInterface } from "./external/ZoneInterface.sol";
import { SIP7Interface } from "./external/SIP7Interface.sol";
import { SIP5Interface } from "./external/SIP5Interface.sol";
import { AdvancedOrder, CriteriaResolver, ZoneParameters, Schema } from "./external/ConsiderationStructs.sol";
import { EIP712, ECDSA } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title  SIP07 Zone
 * @author Tony Snark
 * @notice Standard implementation of the SIP7 specs with a hook for extensibility via inheritance.
 * @dev This implementation is not fully gas optimized.
 */
contract SIP7Zone is ZoneInterface, EIP712, Ownable, SIP7Interface, SIP5Interface {
    enum SignerStatus {
        NEW,
        AUTHORIZED,
        REMOVED
    }

    bytes32 public constant SIGNED_ORDER_HASHTYPE =
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

    ///@inheritdoc SIP7Interface
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

    ///@inheritdoc SIP7Interface
    function removeSigner(address signer) external onlyOwner {
        SignerStatus status = signerStatus[signer];
        if (status == SignerStatus.AUTHORIZED) {
            signerStatus[signer] = SignerStatus.REMOVED;
            emit SignerRemoved(signer);
        } else {
            revert SignerNotActive(signer);
        }
    }

    ///@inheritdoc SIP7Interface
    function updateAPIEndpoint(string calldata newApiEndpoint) external onlyOwner {
        // Update to the new API endpoint.
        _sip7APIEndpoint = newApiEndpoint;
    }

    ///@inheritdoc ZoneInterface
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

    /**
     * @dev Overridable function for custom context validation.
     *      It should revert if validation fails.
     * @param zoneParameters Parameters to validate
     * @param context Context to validate
     */
    function _validateContext(ZoneParameters calldata zoneParameters, bytes memory context) internal view virtual {}

    /// @dev It validates expiry and signature
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
                keccak256(abi.encode(SIGNED_ORDER_HASHTYPE, fulfiller, expiration, orderHash, keccak256(context)))
            );
    }

    ///@inheritdoc SIP7Interface
    function sip7Information() external view returns (bytes32 domainSeparator, string memory apiEndpoint) {
        // Derive the domain separator.
        domainSeparator = _domainSeparatorV4();

        // Return the API endpoint.
        apiEndpoint = _sip7APIEndpoint;
    }

    ///@inheritdoc SIP5Interface
    function getSeaportMetadata() external view returns (string memory name, Schema[] memory schemas) {
        name = _zoneName;
        schemas = new Schema[](1);
        schemas[0].id = 7;
    }
}
