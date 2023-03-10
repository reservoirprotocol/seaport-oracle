/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export type OfferItemStruct = {
  itemType: BigNumberish;
  token: string;
  identifierOrCriteria: BigNumberish;
  startAmount: BigNumberish;
  endAmount: BigNumberish;
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
  itemType: BigNumberish;
  token: string;
  identifierOrCriteria: BigNumberish;
  startAmount: BigNumberish;
  endAmount: BigNumberish;
  recipient: string;
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
  offerer: string;
  zone: string;
  offer: OfferItemStruct[];
  consideration: ConsiderationItemStruct[];
  orderType: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  zoneHash: BytesLike;
  salt: BigNumberish;
  conduitKey: BytesLike;
  totalOriginalConsiderationItems: BigNumberish;
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
  numerator: BigNumberish;
  denominator: BigNumberish;
  signature: BytesLike;
  extraData: BytesLike;
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
  orderIndex: BigNumberish;
  side: BigNumberish;
  index: BigNumberish;
  identifier: BigNumberish;
  criteriaProof: BytesLike[];
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

export interface ZoneInterfaceInterface extends utils.Interface {
  functions: {
    "isValidOrder(bytes32,address,address,bytes32)": FunctionFragment;
    "isValidOrderIncludingExtraData(bytes32,address,((address,address,(uint8,address,uint256,uint256,uint256)[],(uint8,address,uint256,uint256,uint256,address)[],uint8,uint256,uint256,bytes32,uint256,bytes32,uint256),uint120,uint120,bytes,bytes),bytes32[],(uint256,uint8,uint256,uint256,bytes32[])[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "isValidOrder" | "isValidOrderIncludingExtraData"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "isValidOrder",
    values: [BytesLike, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidOrderIncludingExtraData",
    values: [
      BytesLike,
      string,
      AdvancedOrderStruct,
      BytesLike[],
      CriteriaResolverStruct[]
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "isValidOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidOrderIncludingExtraData",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ZoneInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ZoneInterfaceInterface;

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
    isValidOrder(
      orderHash: BytesLike,
      caller: string,
      offerer: string,
      zoneHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { validOrderMagicValue: string }>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      caller: string,
      order: AdvancedOrderStruct,
      priorOrderHashes: BytesLike[],
      criteriaResolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<[string] & { validOrderMagicValue: string }>;
  };

  isValidOrder(
    orderHash: BytesLike,
    caller: string,
    offerer: string,
    zoneHash: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  isValidOrderIncludingExtraData(
    orderHash: BytesLike,
    caller: string,
    order: AdvancedOrderStruct,
    priorOrderHashes: BytesLike[],
    criteriaResolvers: CriteriaResolverStruct[],
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    isValidOrder(
      orderHash: BytesLike,
      caller: string,
      offerer: string,
      zoneHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      caller: string,
      order: AdvancedOrderStruct,
      priorOrderHashes: BytesLike[],
      criteriaResolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    isValidOrder(
      orderHash: BytesLike,
      caller: string,
      offerer: string,
      zoneHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      caller: string,
      order: AdvancedOrderStruct,
      priorOrderHashes: BytesLike[],
      criteriaResolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isValidOrder(
      orderHash: BytesLike,
      caller: string,
      offerer: string,
      zoneHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      caller: string,
      order: AdvancedOrderStruct,
      priorOrderHashes: BytesLike[],
      criteriaResolvers: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
