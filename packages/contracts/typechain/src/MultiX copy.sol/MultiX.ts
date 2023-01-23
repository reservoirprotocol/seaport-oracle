/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
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
} from "../../common";

export type OfferItemStruct = {
  itemType: PromiseOrValue<BigNumberish>;
  token: PromiseOrValue<string>;
  identifierOrCriteria: PromiseOrValue<BigNumberish>;
  startAmount: PromiseOrValue<BigNumberish>;
  endAmount: PromiseOrValue<BigNumberish>;
};

export type OfferItemStructOutput = [
  number,
  string,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  itemType: number;
  token: string;
  identifierOrCriteria: BigNumber;
  startAmount: BigNumber;
  endAmount: BigNumber;
};

export type ConsiderationItemStruct = {
  itemType: PromiseOrValue<BigNumberish>;
  token: PromiseOrValue<string>;
  identifierOrCriteria: PromiseOrValue<BigNumberish>;
  startAmount: PromiseOrValue<BigNumberish>;
  endAmount: PromiseOrValue<BigNumberish>;
  recipient: PromiseOrValue<string>;
};

export type ConsiderationItemStructOutput = [
  number,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  string
] & {
  itemType: number;
  token: string;
  identifierOrCriteria: BigNumber;
  startAmount: BigNumber;
  endAmount: BigNumber;
  recipient: string;
};

export type OrderParametersStruct = {
  offerer: PromiseOrValue<string>;
  zone: PromiseOrValue<string>;
  offer: OfferItemStruct[];
  consideration: ConsiderationItemStruct[];
  orderType: PromiseOrValue<BigNumberish>;
  startTime: PromiseOrValue<BigNumberish>;
  endTime: PromiseOrValue<BigNumberish>;
  zoneHash: PromiseOrValue<BytesLike>;
  salt: PromiseOrValue<BigNumberish>;
  conduitKey: PromiseOrValue<BytesLike>;
  totalOriginalConsiderationItems: PromiseOrValue<BigNumberish>;
};

export type OrderParametersStructOutput = [
  string,
  string,
  OfferItemStructOutput[],
  ConsiderationItemStructOutput[],
  number,
  BigNumber,
  BigNumber,
  string,
  BigNumber,
  string,
  BigNumber
] & {
  offerer: string;
  zone: string;
  offer: OfferItemStructOutput[];
  consideration: ConsiderationItemStructOutput[];
  orderType: number;
  startTime: BigNumber;
  endTime: BigNumber;
  zoneHash: string;
  salt: BigNumber;
  conduitKey: string;
  totalOriginalConsiderationItems: BigNumber;
};

export type AdvancedOrderStruct = {
  parameters: OrderParametersStruct;
  numerator: PromiseOrValue<BigNumberish>;
  denominator: PromiseOrValue<BigNumberish>;
  signature: PromiseOrValue<BytesLike>;
  extraData: PromiseOrValue<BytesLike>;
};

export type AdvancedOrderStructOutput = [
  OrderParametersStructOutput,
  BigNumber,
  BigNumber,
  string,
  string
] & {
  parameters: OrderParametersStructOutput;
  numerator: BigNumber;
  denominator: BigNumber;
  signature: string;
  extraData: string;
};

export type CriteriaResolverStruct = {
  orderIndex: PromiseOrValue<BigNumberish>;
  side: PromiseOrValue<BigNumberish>;
  index: PromiseOrValue<BigNumberish>;
  identifier: PromiseOrValue<BigNumberish>;
  criteriaProof: PromiseOrValue<BytesLike>[];
};

export type CriteriaResolverStructOutput = [
  BigNumber,
  number,
  BigNumber,
  BigNumber,
  string[]
] & {
  orderIndex: BigNumber;
  side: number;
  index: BigNumber;
  identifier: BigNumber;
  criteriaProof: string[];
};

export interface MultiXInterface extends utils.Interface {
  functions: {
    "CONSIDERATION_ITEM_HASHTYPE()": FunctionFragment;
    "CRITERIA_RESOLVER_HASHTYPE()": FunctionFragment;
    "SIGNED_ORDER_HASHTYPE()": FunctionFragment;
    "isValidOrder(bytes32,address,address,bytes32)": FunctionFragment;
    "isValidOrderIncludingExtraData(bytes32,address,((address,address,(uint8,address,uint256,uint256,uint256)[],(uint8,address,uint256,uint256,uint256,address)[],uint8,uint256,uint256,bytes32,uint256,bytes32,uint256),uint120,uint120,bytes,bytes),bytes32[],(uint256,uint8,uint256,uint256,bytes32[])[])": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setSigner(address)": FunctionFragment;
    "signer()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "CONSIDERATION_ITEM_HASHTYPE"
      | "CRITERIA_RESOLVER_HASHTYPE"
      | "SIGNED_ORDER_HASHTYPE"
      | "isValidOrder"
      | "isValidOrderIncludingExtraData"
      | "owner"
      | "renounceOwnership"
      | "setSigner"
      | "signer"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "CONSIDERATION_ITEM_HASHTYPE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "CRITERIA_RESOLVER_HASHTYPE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SIGNED_ORDER_HASHTYPE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isValidOrder",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidOrderIncludingExtraData",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      AdvancedOrderStruct,
      PromiseOrValue<BytesLike>[],
      CriteriaResolverStruct[]
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setSigner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "signer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "CONSIDERATION_ITEM_HASHTYPE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "CRITERIA_RESOLVER_HASHTYPE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SIGNED_ORDER_HASHTYPE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidOrderIncludingExtraData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setSigner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "signer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface MultiX extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MultiXInterface;

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
    CONSIDERATION_ITEM_HASHTYPE(overrides?: CallOverrides): Promise<[string]>;

    CRITERIA_RESOLVER_HASHTYPE(overrides?: CallOverrides): Promise<[string]>;

    SIGNED_ORDER_HASHTYPE(overrides?: CallOverrides): Promise<[string]>;

    isValidOrder(
      arg0: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isValidOrderIncludingExtraData(
      orderHash: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      order: AdvancedOrderStruct,
      arg3: PromiseOrValue<BytesLike>[],
      resolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<[string] & { validOrderMagicValue: string }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSigner(
      signer_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    signer(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  CONSIDERATION_ITEM_HASHTYPE(overrides?: CallOverrides): Promise<string>;

  CRITERIA_RESOLVER_HASHTYPE(overrides?: CallOverrides): Promise<string>;

  SIGNED_ORDER_HASHTYPE(overrides?: CallOverrides): Promise<string>;

  isValidOrder(
    arg0: PromiseOrValue<BytesLike>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<string>,
    arg3: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  isValidOrderIncludingExtraData(
    orderHash: PromiseOrValue<BytesLike>,
    arg1: PromiseOrValue<string>,
    order: AdvancedOrderStruct,
    arg3: PromiseOrValue<BytesLike>[],
    resolvers: CriteriaResolverStruct[],
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSigner(
    signer_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    CONSIDERATION_ITEM_HASHTYPE(overrides?: CallOverrides): Promise<string>;

    CRITERIA_RESOLVER_HASHTYPE(overrides?: CallOverrides): Promise<string>;

    SIGNED_ORDER_HASHTYPE(overrides?: CallOverrides): Promise<string>;

    isValidOrder(
      arg0: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    isValidOrderIncludingExtraData(
      orderHash: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      order: AdvancedOrderStruct,
      arg3: PromiseOrValue<BytesLike>[],
      resolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setSigner(
      signer_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    signer(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    CONSIDERATION_ITEM_HASHTYPE(overrides?: CallOverrides): Promise<BigNumber>;

    CRITERIA_RESOLVER_HASHTYPE(overrides?: CallOverrides): Promise<BigNumber>;

    SIGNED_ORDER_HASHTYPE(overrides?: CallOverrides): Promise<BigNumber>;

    isValidOrder(
      arg0: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isValidOrderIncludingExtraData(
      orderHash: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      order: AdvancedOrderStruct,
      arg3: PromiseOrValue<BytesLike>[],
      resolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSigner(
      signer_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    signer(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CONSIDERATION_ITEM_HASHTYPE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    CRITERIA_RESOLVER_HASHTYPE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    SIGNED_ORDER_HASHTYPE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidOrder(
      arg0: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<string>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidOrderIncludingExtraData(
      orderHash: PromiseOrValue<BytesLike>,
      arg1: PromiseOrValue<string>,
      order: AdvancedOrderStruct,
      arg3: PromiseOrValue<BytesLike>[],
      resolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSigner(
      signer_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    signer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
