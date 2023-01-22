// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IMultiX {
    function setSigner(address signer) external;

    function signer() external returns (address);
}
