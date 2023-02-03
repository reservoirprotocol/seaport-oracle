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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface SignedZoneInterfaceInterface extends utils.Interface {
  functions: {
    "addSigner(address)": FunctionFragment;
    "getActiveSigners()": FunctionFragment;
    "removeSigner(address)": FunctionFragment;
    "sip7Information()": FunctionFragment;
    "updateAPIEndpoint(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addSigner"
      | "getActiveSigners"
      | "removeSigner"
      | "sip7Information"
      | "updateAPIEndpoint"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addSigner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getActiveSigners",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeSigner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "sip7Information",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateAPIEndpoint",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "addSigner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getActiveSigners",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sip7Information",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateAPIEndpoint",
    data: BytesLike
  ): Result;

  events: {};
}

export interface SignedZoneInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SignedZoneInterfaceInterface;

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
    addSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getActiveSigners(
      overrides?: CallOverrides
    ): Promise<[string[]] & { signers: string[] }>;

    removeSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    sip7Information(
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber[], string] & {
        domainSeparator: string;
        apiEndpoint: string;
        substandards: BigNumber[];
        documentationURI: string;
      }
    >;

    updateAPIEndpoint(
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addSigner(
    signer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getActiveSigners(overrides?: CallOverrides): Promise<string[]>;

  removeSigner(
    signer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  sip7Information(
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber[], string] & {
      domainSeparator: string;
      apiEndpoint: string;
      substandards: BigNumber[];
      documentationURI: string;
    }
  >;

  updateAPIEndpoint(
    newApiEndpoint: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addSigner(
      signer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getActiveSigners(overrides?: CallOverrides): Promise<string[]>;

    removeSigner(
      signer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    sip7Information(
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber[], string] & {
        domainSeparator: string;
        apiEndpoint: string;
        substandards: BigNumber[];
        documentationURI: string;
      }
    >;

    updateAPIEndpoint(
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getActiveSigners(overrides?: CallOverrides): Promise<BigNumber>;

    removeSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    sip7Information(overrides?: CallOverrides): Promise<BigNumber>;

    updateAPIEndpoint(
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getActiveSigners(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    sip7Information(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    updateAPIEndpoint(
      newApiEndpoint: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
