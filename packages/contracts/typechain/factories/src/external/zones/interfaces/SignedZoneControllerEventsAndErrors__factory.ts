/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  SignedZoneControllerEventsAndErrors,
  SignedZoneControllerEventsAndErrorsInterface,
} from "../../../../../src/external/zones/interfaces/SignedZoneControllerEventsAndErrors";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "zone",
        type: "address",
      },
    ],
    name: "CallerIsNotNewPotentialOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "zone",
        type: "address",
      },
    ],
    name: "CallerIsNotOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "zone",
        type: "address",
      },
    ],
    name: "CallerIsNotOwnerOrSigner",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCreator",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "zone",
        type: "address",
      },
      {
        internalType: "address",
        name: "newPotentialOwner",
        type: "address",
      },
    ],
    name: "NewPotentialOwnerAlreadySet",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "zone",
        type: "address",
      },
    ],
    name: "NewPotentialOwnerIsZeroAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "zone",
        type: "address",
      },
    ],
    name: "NoPotentialOwnerCurrentlySet",
    type: "error",
  },
  {
    inputs: [],
    name: "NoZone",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "SignerAlreadyAdded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "SignerCannotBeReauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "SignerCannotBeZeroAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "SignerNotPresent",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "zone",
        type: "address",
      },
    ],
    name: "ZoneAlreadyExists",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "zone",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newPotentialOwner",
        type: "address",
      },
    ],
    name: "PotentialOwnerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "signedZone",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "SignerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "zoneAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "zoneName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "apiEndpoint",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "documentationURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "ZoneCreated",
    type: "event",
  },
] as const;

export class SignedZoneControllerEventsAndErrors__factory {
  static readonly abi = _abi;
  static createInterface(): SignedZoneControllerEventsAndErrorsInterface {
    return new utils.Interface(
      _abi
    ) as SignedZoneControllerEventsAndErrorsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SignedZoneControllerEventsAndErrors {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SignedZoneControllerEventsAndErrors;
  }
}
