/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Breakwater, BreakwaterInterface } from "../../src/Breakwater";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidExtraData",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fulfiller",
        type: "address",
      },
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "orderHash",
        type: "bytes32",
      },
    ],
    name: "InvalidFulfiller",
    type: "error",
  },
  {
    inputs: [],
    name: "MissingExtraData",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currentTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiration",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "orderHash",
        type: "bytes32",
      },
    ],
    name: "SignatureExpired",
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
    inputs: [],
    name: "SignerCannotBeReauthorized",
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
    name: "SignerNotActive",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "orderHash",
        type: "bytes32",
      },
    ],
    name: "SignerNotApproved",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
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
        indexed: false,
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "SignerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "SignerRemoved",
    type: "event",
  },
  {
    inputs: [],
    name: "SIGNED_ORDER_HASHTYPE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "addSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "removeSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "signerStatus",
    outputs: [
      {
        internalType: "enum Breakwater.SignerStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "orderHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "fulfiller",
            type: "address",
          },
          {
            internalType: "address",
            name: "offerer",
            type: "address",
          },
          {
            components: [
              {
                internalType: "enum ItemType",
                name: "itemType",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "identifier",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct SpentItem[]",
            name: "offer",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "enum ItemType",
                name: "itemType",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "identifier",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "recipient",
                type: "address",
              },
            ],
            internalType: "struct ReceivedItem[]",
            name: "consideration",
            type: "tuple[]",
          },
          {
            internalType: "bytes",
            name: "extraData",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "orderHashes",
            type: "bytes32[]",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "zoneHash",
            type: "bytes32",
          },
        ],
        internalType: "struct ZoneParameters",
        name: "zoneParameters",
        type: "tuple",
      },
    ],
    name: "validateOrder",
    outputs: [
      {
        internalType: "bytes4",
        name: "validOrderMagicValue",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101406040523480156200001257600080fd5b5060405162001335380380620013358339810160408190526200003591620001ec565b815160208084019190912082518383012060e08290526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818801819052818301969096526060810194909452608080850193909352308483018190528151808603909301835260c09485019091528151919095012090529190915261012052620000cf33620000d7565b505062000256565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200014f57600080fd5b81516001600160401b03808211156200016c576200016c62000127565b604051601f8301601f19908116603f0116810190828211818310171562000197576200019762000127565b81604052838152602092508683858801011115620001b457600080fd5b600091505b83821015620001d85785820183015181830184015290820190620001b9565b600093810190920192909252949350505050565b600080604083850312156200020057600080fd5b82516001600160401b03808211156200021857600080fd5b62000226868387016200013d565b935060208501519150808211156200023d57600080fd5b506200024c858286016200013d565b9150509250929050565b60805160a05160c05160e051610100516101205161108f620002a66000396000610c4801526000610c9701526000610c7201526000610bcb01526000610bf501526000610c1f015261108f6000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063a7528e5b1161005b578063a7528e5b14610111578063aaf3a79e14610141578063bfe51c1014610154578063f2fde38b1461016757600080fd5b806317b1f9421461008d57806334230323146100d6578063715018a6146100ec5780638da5cb5b146100f6575b600080fd5b6100a061009b366004610da9565b61017a565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020015b60405180910390f35b6100de61038b565b6040519081526020016100cd565b6100f4610423565b005b6000546040516001600160a01b0390911681526020016100cd565b61013461011f366004610e01565b60016020526000908152604090205460ff1681565b6040516100cd9190610e34565b6100f461014f366004610e01565b610437565b6100f4610162366004610e01565b61050f565b6100f4610175366004610e01565b610628565b6000600161018b60a0840184610e5c565b905010156101c5576040517f8c43c55a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60626101d460a0840184610e5c565b9050101561020e576040517f7ab7059600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008080808061022160a0880188610e5c565b81019061022e9190610f6b565b9398509196509450925090507fff00000000000000000000000000000000000000000000000000000000000000851615158061026c57508151604014155b156102a3576040517f7ab7059600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600160a01b038416158015906102dc57506102c66040880160208901610e01565b6001600160a01b0316846001600160a01b031614155b1561034357836102f26040890160208a01610e01565b6040517f1bcf9bb70000000000000000000000000000000000000000000000000000000081526001600160a01b03928316600482015291166024820152873560448201526064015b60405180910390fd5b61035f846bffffffffffffffffffffffff8516893584866106b8565b507f17b1f942000000000000000000000000000000000000000000000000000000009695505050505050565b60405160200161040a907f5369676e65644f7264657228616464726573732066756c66696c6c65722c756981527f6e743235362065787069726174696f6e2c62797465733332206f72646572486160208201527f73682c627974657320636f6e7465787429000000000000000000000000000000604082015260510190565b6040516020818303038152906040528051906020012081565b61042b6107bf565b6104356000610819565b565b61043f6107bf565b6001600160a01b03811660009081526001602081905260409091205460ff169081600281111561047157610471610e1e565b036104d2576001600160a01b038216600081815260016020908152604091829020805460ff1916600217905590519182527f3525e22824a8a7df2c9a6029941c824cf95b6447f1e13d5128fd3826d35afe8b91015b60405180910390a15050565b6040517f3a5a4c210000000000000000000000000000000000000000000000000000000081526001600160a01b038316600482015260240161033a565b6105176107bf565b6001600160a01b03811660009081526001602052604081205460ff169081600281111561054657610546610e1e565b036105a0576001600160a01b038216600081815260016020818152604092839020805460ff191690921790915590519182527f47d1c22a25bb3a5d4e481b9b1e6944c2eade3181a0a20b495ed61d35b5323f2491016104c6565b60018160028111156105b4576105b4610e1e565b036105f6576040517fcb89b9b00000000000000000000000000000000000000000000000000000000081526001600160a01b038316600482015260240161033a565b6040517f9321fad100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6106306107bf565b6001600160a01b0381166106ac5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161033a565b6106b581610819565b50565b83421115610702576040517f431be9c1000000000000000000000000000000000000000000000000000000008152426004820152602481018590526044810184905260640161033a565b600061071086868686610881565b905060008083806020019051810190610729919061103d565b91509150600061073a848484610972565b905060016001600160a01b03821660009081526001602052604090205460ff16600281111561076b5761076b610e1e565b146107b4576040517f682498150000000000000000000000000000000000000000000000000000000081526001600160a01b03821660048201526024810188905260440161033a565b505050505050505050565b6000546001600160a01b031633146104355760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161033a565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000610969604051602001610905907f5369676e65644f7264657228616464726573732066756c66696c6c65722c756981527f6e743235362065787069726174696f6e2c62797465733332206f72646572486160208201527f73682c627974657320636f6e7465787429000000000000000000000000000000604082015260510190565b60408051601f198184030181528282528051602091820120865187830120918401526001600160a01b03891691830191909152606082018790526080820186905260a082015260c00160405160208183030381529060405280519060200120610998565b95945050505050565b6000806000610982868686610a07565b9150915061098f81610a59565b50949350505050565b6000610a016109a5610bbe565b836040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b92915050565b6000807f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831681610a3d60ff86901c601b611061565b9050610a4b87828885610ce5565b935093505050935093915050565b6000816004811115610a6d57610a6d610e1e565b03610a755750565b6001816004811115610a8957610a89610e1e565b03610ad65760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161033a565b6002816004811115610aea57610aea610e1e565b03610b375760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161033a565b6003816004811115610b4b57610b4b610e1e565b036106b55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f7565000000000000000000000000000000000000000000000000000000000000606482015260840161033a565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015610c1757507f000000000000000000000000000000000000000000000000000000000000000046145b15610c4157507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115610d1c5750600090506003610da0565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610d70573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610d9957600060019250925050610da0565b9150600090505b94509492505050565b600060208284031215610dbb57600080fd5b813567ffffffffffffffff811115610dd257600080fd5b82016101408185031215610de557600080fd5b9392505050565b6001600160a01b03811681146106b557600080fd5b600060208284031215610e1357600080fd5b8135610de581610dec565b634e487b7160e01b600052602160045260246000fd5b6020810160038310610e5657634e487b7160e01b600052602160045260246000fd5b91905290565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610e9157600080fd5b83018035915067ffffffffffffffff821115610eac57600080fd5b602001915036819003821315610ec157600080fd5b9250929050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112610eef57600080fd5b813567ffffffffffffffff80821115610f0a57610f0a610ec8565b604051601f8301601f19908116603f01168101908282118183101715610f3257610f32610ec8565b81604052838152866020858801011115610f4b57600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080600060a08688031215610f8357600080fd5b85357fff0000000000000000000000000000000000000000000000000000000000000081168114610fb357600080fd5b94506020860135610fc381610dec565b935060408601356bffffffffffffffffffffffff81168114610fe457600080fd5b9250606086013567ffffffffffffffff8082111561100157600080fd5b61100d89838a01610ede565b9350608088013591508082111561102357600080fd5b5061103088828901610ede565b9150509295509295909350565b6000806040838503121561105057600080fd5b505080516020909101519092909150565b80820180821115610a0157634e487b7160e01b600052601160045260246000fdfea164736f6c6343000811000a";

type BreakwaterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BreakwaterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Breakwater__factory extends ContractFactory {
  constructor(...args: BreakwaterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    version: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Breakwater> {
    return super.deploy(name, version, overrides || {}) as Promise<Breakwater>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    version: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, version, overrides || {});
  }
  override attach(address: string): Breakwater {
    return super.attach(address) as Breakwater;
  }
  override connect(signer: Signer): Breakwater__factory {
    return super.connect(signer) as Breakwater__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BreakwaterInterface {
    return new utils.Interface(_abi) as BreakwaterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Breakwater {
    return new Contract(address, _abi, signerOrProvider) as Breakwater;
  }
}
