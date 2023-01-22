// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ZoneInterface } from "../external/ZoneInterface.sol";

interface IBreakwater is ZoneInterface {
    function setSigner(address signer) external;

    function signer() external returns (address);
}
