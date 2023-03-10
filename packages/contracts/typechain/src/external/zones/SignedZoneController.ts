/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface SignedZoneControllerInterface extends utils.Interface {
  functions: {
    "acceptOwnership(address)": FunctionFragment;
    "cancelOwnershipTransfer(address)": FunctionFragment;
    "createZone(string,string,string,address,bytes32)": FunctionFragment;
    "getActiveSigners(address)": FunctionFragment;
    "getAdditionalZoneInformation(address)": FunctionFragment;
    "getPotentialOwner(address)": FunctionFragment;
    "getZone(bytes32)": FunctionFragment;
    "ownerOf(address)": FunctionFragment;
    "transferOwnership(address,address)": FunctionFragment;
    "updateAPIEndpoint(address,string)": FunctionFragment;
    "updateSigner(address,address,bool)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptOwnership"
      | "cancelOwnershipTransfer"
      | "createZone"
      | "getActiveSigners"
      | "getAdditionalZoneInformation"
      | "getPotentialOwner"
      | "getZone"
      | "ownerOf"
      | "transferOwnership"
      | "updateAPIEndpoint"
      | "updateSigner"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelOwnershipTransfer",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "createZone",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getActiveSigners",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAdditionalZoneInformation",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPotentialOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getZone",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateAPIEndpoint",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSigner",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelOwnershipTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createZone", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getActiveSigners",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAdditionalZoneInformation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPotentialOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getZone", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateAPIEndpoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSigner",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address,address)": EventFragment;
    "PotentialOwnerUpdated(address)": EventFragment;
    "SignerUpdated(address,address,bool)": EventFragment;
    "ZoneCreated(address,string,string,string,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PotentialOwnerUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SignerUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ZoneCreated"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  zone: string;
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PotentialOwnerUpdatedEventObject {
  newPotentialOwner: string;
}
export type PotentialOwnerUpdatedEvent = TypedEvent<
  [string],
  PotentialOwnerUpdatedEventObject
>;

export type PotentialOwnerUpdatedEventFilter =
  TypedEventFilter<PotentialOwnerUpdatedEvent>;

export interface SignerUpdatedEventObject {
  signedZone: string;
  signer: string;
  active: boolean;
}
export type SignerUpdatedEvent = TypedEvent<
  [string, string, boolean],
  SignerUpdatedEventObject
>;

export type SignerUpdatedEventFilter = TypedEventFilter<SignerUpdatedEvent>;

export interface ZoneCreatedEventObject {
  zoneAddress: string;
  zoneName: string;
  apiEndpoint: string;
  documentationURI: string;
  salt: string;
}
export type ZoneCreatedEvent = TypedEvent<
  [string, string, string, string, string],
  ZoneCreatedEventObject
>;

export type ZoneCreatedEventFilter = TypedEventFilter<ZoneCreatedEvent>;

export interface SignedZoneController extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SignedZoneControllerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    acceptOwnership(
      zone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    cancelOwnershipTransfer(
      zone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createZone(
      zoneName: PromiseOrValue<string>,
      apiEndpoint: PromiseOrValue<string>,
      documentationURI: PromiseOrValue<string>,
      initialOwner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getActiveSigners(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[]] & { signers: string[] }>;

    getAdditionalZoneInformation(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber[], string] & {
        domainSeparator: string;
        zoneName: string;
        apiEndpoint: string;
        substandards: BigNumber[];
        documentationURI: string;
      }
    >;

    getPotentialOwner(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string] & { potentialOwner: string }>;

    getZone(
      salt: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string] & { derivedAddress: string }>;

    ownerOf(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string] & { owner: string }>;

    transferOwnership(
      zone: PromiseOrValue<string>,
      newPotentialOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateAPIEndpoint(
      zone: PromiseOrValue<string>,
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateSigner(
      zone: PromiseOrValue<string>,
      signer: PromiseOrValue<string>,
      active: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  acceptOwnership(
    zone: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  cancelOwnershipTransfer(
    zone: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createZone(
    zoneName: PromiseOrValue<string>,
    apiEndpoint: PromiseOrValue<string>,
    documentationURI: PromiseOrValue<string>,
    initialOwner: PromiseOrValue<string>,
    salt: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getActiveSigners(
    zone: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  getAdditionalZoneInformation(
    zone: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, BigNumber[], string] & {
      domainSeparator: string;
      zoneName: string;
      apiEndpoint: string;
      substandards: BigNumber[];
      documentationURI: string;
    }
  >;

  getPotentialOwner(
    zone: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getZone(
    salt: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  ownerOf(
    zone: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  transferOwnership(
    zone: PromiseOrValue<string>,
    newPotentialOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateAPIEndpoint(
    zone: PromiseOrValue<string>,
    newApiEndpoint: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateSigner(
    zone: PromiseOrValue<string>,
    signer: PromiseOrValue<string>,
    active: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptOwnership(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    cancelOwnershipTransfer(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    createZone(
      zoneName: PromiseOrValue<string>,
      apiEndpoint: PromiseOrValue<string>,
      documentationURI: PromiseOrValue<string>,
      initialOwner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    getActiveSigners(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    getAdditionalZoneInformation(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber[], string] & {
        domainSeparator: string;
        zoneName: string;
        apiEndpoint: string;
        substandards: BigNumber[];
        documentationURI: string;
      }
    >;

    getPotentialOwner(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getZone(
      salt: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    ownerOf(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    transferOwnership(
      zone: PromiseOrValue<string>,
      newPotentialOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateAPIEndpoint(
      zone: PromiseOrValue<string>,
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSigner(
      zone: PromiseOrValue<string>,
      signer: PromiseOrValue<string>,
      active: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address,address)"(
      zone?: PromiseOrValue<string> | null,
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      zone?: PromiseOrValue<string> | null,
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "PotentialOwnerUpdated(address)"(
      newPotentialOwner?: PromiseOrValue<string> | null
    ): PotentialOwnerUpdatedEventFilter;
    PotentialOwnerUpdated(
      newPotentialOwner?: PromiseOrValue<string> | null
    ): PotentialOwnerUpdatedEventFilter;

    "SignerUpdated(address,address,bool)"(
      signedZone?: null,
      signer?: null,
      active?: null
    ): SignerUpdatedEventFilter;
    SignerUpdated(
      signedZone?: null,
      signer?: null,
      active?: null
    ): SignerUpdatedEventFilter;

    "ZoneCreated(address,string,string,string,bytes32)"(
      zoneAddress?: null,
      zoneName?: null,
      apiEndpoint?: null,
      documentationURI?: null,
      salt?: null
    ): ZoneCreatedEventFilter;
    ZoneCreated(
      zoneAddress?: null,
      zoneName?: null,
      apiEndpoint?: null,
      documentationURI?: null,
      salt?: null
    ): ZoneCreatedEventFilter;
  };

  estimateGas: {
    acceptOwnership(
      zone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    cancelOwnershipTransfer(
      zone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createZone(
      zoneName: PromiseOrValue<string>,
      apiEndpoint: PromiseOrValue<string>,
      documentationURI: PromiseOrValue<string>,
      initialOwner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getActiveSigners(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAdditionalZoneInformation(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPotentialOwner(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getZone(
      salt: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ownerOf(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      zone: PromiseOrValue<string>,
      newPotentialOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateAPIEndpoint(
      zone: PromiseOrValue<string>,
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateSigner(
      zone: PromiseOrValue<string>,
      signer: PromiseOrValue<string>,
      active: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptOwnership(
      zone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    cancelOwnershipTransfer(
      zone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createZone(
      zoneName: PromiseOrValue<string>,
      apiEndpoint: PromiseOrValue<string>,
      documentationURI: PromiseOrValue<string>,
      initialOwner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getActiveSigners(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAdditionalZoneInformation(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPotentialOwner(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getZone(
      salt: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ownerOf(
      zone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      zone: PromiseOrValue<string>,
      newPotentialOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateAPIEndpoint(
      zone: PromiseOrValue<string>,
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateSigner(
      zone: PromiseOrValue<string>,
      signer: PromiseOrValue<string>,
      active: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
