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
} from "./common";

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

export interface CancelXInterface extends utils.Interface {
  functions: {
    "MINT_TOKEN_HASHTYPE()": FunctionFragment;
    "isValidOrder(bytes32,address,address,bytes32)": FunctionFragment;
    "isValidOrderIncludingExtraData(bytes32,address,((address,address,(uint8,address,uint256,uint256,uint256)[],(uint8,address,uint256,uint256,uint256,address)[],uint8,uint256,uint256,bytes32,uint256,bytes32,uint256),uint120,uint120,bytes,bytes),bytes32[],(uint256,uint8,uint256,uint256,bytes32[])[])": FunctionFragment;
    "signer()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MINT_TOKEN_HASHTYPE"
      | "isValidOrder"
      | "isValidOrderIncludingExtraData"
      | "signer"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "MINT_TOKEN_HASHTYPE",
    values?: undefined
  ): string;
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
  encodeFunctionData(functionFragment: "signer", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "MINT_TOKEN_HASHTYPE",
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
  decodeFunctionResult(functionFragment: "signer", data: BytesLike): Result;

  events: {};
}

export interface CancelX extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CancelXInterface;

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
    MINT_TOKEN_HASHTYPE(overrides?: CallOverrides): Promise<[string]>;

    isValidOrder(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      arg1: string,
      order: AdvancedOrderStruct,
      arg3: BytesLike[],
      arg4: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<[string] & { validOrderMagicValue: string }>;

    signer(overrides?: CallOverrides): Promise<[string]>;
  };

  MINT_TOKEN_HASHTYPE(overrides?: CallOverrides): Promise<string>;

  isValidOrder(
    arg0: BytesLike,
    arg1: string,
    arg2: string,
    arg3: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  isValidOrderIncludingExtraData(
    orderHash: BytesLike,
    arg1: string,
    order: AdvancedOrderStruct,
    arg3: BytesLike[],
    arg4: CriteriaResolverStruct[],
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    MINT_TOKEN_HASHTYPE(overrides?: CallOverrides): Promise<string>;

    isValidOrder(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      arg1: string,
      order: AdvancedOrderStruct,
      arg3: BytesLike[],
      arg4: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<string>;

    signer(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    MINT_TOKEN_HASHTYPE(overrides?: CallOverrides): Promise<BigNumber>;

    isValidOrder(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      arg1: string,
      order: AdvancedOrderStruct,
      arg3: BytesLike[],
      arg4: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    signer(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    MINT_TOKEN_HASHTYPE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidOrder(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidOrderIncludingExtraData(
      orderHash: BytesLike,
      arg1: string,
      order: AdvancedOrderStruct,
      arg3: BytesLike[],
      arg4: CriteriaResolverStruct[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    signer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}