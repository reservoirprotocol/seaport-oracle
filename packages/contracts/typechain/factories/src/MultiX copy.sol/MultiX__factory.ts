/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  MultiX,
  MultiXInterface,
} from "../../../src/MultiX copy.sol/MultiX";

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
      {
        internalType: "address",
        name: "signer_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Breakwater__InvalidConsideration",
    type: "error",
  },
  {
    inputs: [],
    name: "Breakwater__InvalidCriteriaResolvers",
    type: "error",
  },
  {
    inputs: [],
    name: "Breakwater__InvalidOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "Breakwater__InvalidSigner",
    type: "error",
  },
  {
    inputs: [],
    name: "Breakwater__OrderValidityExpired",
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
    inputs: [],
    name: "CONSIDERATION_ITEM_HASHTYPE",
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
    inputs: [],
    name: "CRITERIA_RESOLVER_HASHTYPE",
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
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "isValidOrder",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orderHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "offerer",
                type: "address",
              },
              {
                internalType: "address",
                name: "zone",
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
                    name: "identifierOrCriteria",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "startAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "endAmount",
                    type: "uint256",
                  },
                ],
                internalType: "struct OfferItem[]",
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
                    name: "identifierOrCriteria",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "startAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "endAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "address payable",
                    name: "recipient",
                    type: "address",
                  },
                ],
                internalType: "struct ConsiderationItem[]",
                name: "consideration",
                type: "tuple[]",
              },
              {
                internalType: "enum OrderType",
                name: "orderType",
                type: "uint8",
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
              {
                internalType: "uint256",
                name: "salt",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "conduitKey",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "totalOriginalConsiderationItems",
                type: "uint256",
              },
            ],
            internalType: "struct OrderParameters",
            name: "parameters",
            type: "tuple",
          },
          {
            internalType: "uint120",
            name: "numerator",
            type: "uint120",
          },
          {
            internalType: "uint120",
            name: "denominator",
            type: "uint120",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "extraData",
            type: "bytes",
          },
        ],
        internalType: "struct AdvancedOrder",
        name: "order",
        type: "tuple",
      },
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "orderIndex",
            type: "uint256",
          },
          {
            internalType: "enum Side",
            name: "side",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "identifier",
            type: "uint256",
          },
          {
            internalType: "bytes32[]",
            name: "criteriaProof",
            type: "bytes32[]",
          },
        ],
        internalType: "struct CriteriaResolver[]",
        name: "resolvers",
        type: "tuple[]",
      },
    ],
    name: "isValidOrderIncludingExtraData",
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
        name: "signer_",
        type: "address",
      },
    ],
    name: "setSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "signer",
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
] as const;

const _bytecode =
  "0x6101406040523480156200001257600080fd5b5060405162001b7238038062001b7283398101604081905262000035916200020d565b825160208085019190912083518483012060e08290526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818801819052818301969096526060810194909452608080850193909352308483018190528151808603909301835260c09485019091528151919095012090529190915261012052620000cf33620000f8565b600180546001600160a01b0319166001600160a01b0392909216919091179055506200029a9050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200017057600080fd5b81516001600160401b03808211156200018d576200018d62000148565b604051601f8301601f19908116603f01168101908282118183101715620001b857620001b862000148565b81604052838152602092508683858801011115620001d557600080fd5b600091505b83821015620001f95785820183015181830184015290820190620001da565b600093810190920192909252949350505050565b6000806000606084860312156200022357600080fd5b83516001600160401b03808211156200023b57600080fd5b62000249878388016200015e565b945060208601519150808211156200026057600080fd5b506200026f868287016200015e565b604086015190935090506001600160a01b03811681146200028f57600080fd5b809150509250925092565b60805160a05160c05160e0516101005161012051611888620002ea6000396000610f2d01526000610f7c01526000610f5701526000610eb001526000610eda01526000610f0401526118886000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c80633423032311610076578063715018a61161005b578063715018a6146101805780638da5cb5b14610188578063f2fde38b1461019957600080fd5b806334230323146101635780636c19e7831461016b57600080fd5b8063238ac933116100a7578063238ac9331461011d5780632ad6e10f14610148578063331315701461015057600080fd5b806307e634c1146100c35780630e1d31dc146100de575b600080fd5b6100cb6101ac565b6040519081526020015b60405180910390f35b6100ec6100be36600461124d565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016100d5565b600154610130906001600160a01b031681565b6040516001600160a01b0390911681526020016100d5565b6100cb6102e0565b6100ec61015e3660046112da565b6103d9565b6100cb610564565b61017e610179366004611393565b610609565b005b61017e61064b565b6000546001600160a01b0316610130565b61017e6101a7366004611393565b61065f565b6040517f436f6e73696465726174696f6e4974656d28000000000000000000000000000060208201527f75696e7438206974656d547970652c000000000000000000000000000000000060328201527f6164647265737320746f6b656e2c00000000000000000000000000000000000060418201527f75696e74323536206964656e7469666965724f7243726974657269612c000000604f8201527f75696e74323536207374617274416d6f756e742c000000000000000000000000606c8201527f75696e7432353620656e64416d6f756e742c000000000000000000000000000060808201527f6164647265737320726563697069656e740000000000000000000000000000006092820152602960f81b60a382015260a4015b6040516020818303038152906040528051906020012081565b6040517f43726974657269615265736f6c7665722800000000000000000000000000000060208201527f75696e74323536206f72646572496e6465782c0000000000000000000000000060318201527f75696e743820736964652c00000000000000000000000000000000000000000060448201527f75696e7432353620696e6465782c000000000000000000000000000000000000604f8201527f75696e74323536206964656e7469666965722c00000000000000000000000000605d8201527f627974657333325b5d20637269746572696150726f6f660000000000000000006070820152602960f81b60878201526088016102c7565b600080806103ea60808901896113b7565b8101906103f7919061146e565b9150915081602001518a14610438576040517fd8c04d4300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040820151158015906104bf575060408201516104bc6104588a80611547565b610466906060810190611585565b808060200260200160405190810160405280939291908181526020016000905b828210156104b2576104a360c083028601368190038101906115ce565b81526020019060010190610486565b50505050506106f4565b14155b156104f6576040517f6001c01600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6060820151158015906105165750816060015161051386866107c2565b14155b1561054d576040517f6001c01600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6105578282610899565b5050979650505050505050565b6040516020016102c7907f4f7264657256616c69646974792875696e7432353620626c6f636b446561646c81527f696e652c62797465733332206f72646572486173682c6279746573333220636f60208201527f6e73696465726174696f6e486173682c6279746573333220637269746572696160408201527f5265736f6c7665727348617368290000000000000000000000000000000000006060820152606e0190565b610611610928565b600180547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b610653610928565b61065d6000610982565b565b610667610928565b6001600160a01b0381166106e85760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6106f181610982565b50565b8051600090818167ffffffffffffffff811115610713576107136113fe565b60405190808252806020026020018201604052801561073c578160200160208202803683370190505b50905060005b828110156107915761076c85828151811061075f5761075f611664565b60200260200101516109ea565b82828151811061077e5761077e611664565b6020908102919091010152600101610742565b50806040516020016107a3919061167a565b6040516020818303038152906040528051906020012092505050919050565b600081818167ffffffffffffffff8111156107df576107df6113fe565b604051908082528060200260200182016040528015610808578160200160208202803683370190505b50905060005b828110156108675761084286868381811061082b5761082b611664565b905060200281019061083d91906116b0565b610b6e565b82828151811061085457610854611664565b602090810291909101015260010161080e565b5080604051602001610879919061167a565b604051602081830303815290604052805190602001209250505092915050565b8151438110156108d5576040517fcfb73cfe00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006108e084610cdd565b90506108ec8184610df2565b610922576040517f77998e6b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050565b6000546001600160a01b0316331461065d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016106df565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040517f436f6e73696465726174696f6e4974656d28000000000000000000000000000060208201527f75696e7438206974656d547970652c000000000000000000000000000000000060328201527f6164647265737320746f6b656e2c00000000000000000000000000000000000060418201527f75696e74323536206964656e7469666965724f7243726974657269612c000000604f8201527f75696e74323536207374617274416d6f756e742c000000000000000000000000606c8201527f75696e7432353620656e64416d6f756e742c000000000000000000000000000060808201527f6164647265737320726563697069656e740000000000000000000000000000006092820152602960f81b60a382015260009060a40160405160208183030381529060405280519060200120826000015183602001518460400151856060015186608001518760a00151604051602001610b5197969594939291906116fa565b604051602081830303815290604052805190602001209050919050565b6040517f43726974657269615265736f6c7665722800000000000000000000000000000060208201527f75696e74323536206f72646572496e6465782c0000000000000000000000000060318201527f75696e743820736964652c00000000000000000000000000000000000000000060448201527f75696e7432353620696e6465782c000000000000000000000000000000000000604f8201527f75696e74323536206964656e7469666965722c00000000000000000000000000605d8201527f627974657333325b5d20637269746572696150726f6f660000000000000000006070820152602960f81b6087820152600090608801604051602081830303815290604052805190602001208260000135836020016020810190610c93919061174c565b60408501356060860135610caa608088018861176d565b604051602001610cbb9291906117b7565b60408051601f1981840301815290829052610b519695949392916020016117f9565b6000610dec604051602001610d87907f4f7264657256616c69646974792875696e7432353620626c6f636b446561646c81527f696e652c62797465733332206f72646572486173682c6279746573333220636f60208201527f6e73696465726174696f6e486173682c6279746573333220637269746572696160408201527f5265736f6c7665727348617368290000000000000000000000000000000000006060820152606e0190565b60408051601f198184030181528282528051602091820120865187830151888501516060808b0151958801949094529486019190915290840152608083019190915260a082015260c00160405160208183030381529060405280519060200120610e16565b92915050565b6000610dfe8383610e7f565b6001546001600160a01b039182169116149392505050565b6000610dec610e23610ea3565b836040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000610e8e8585610fca565b91509150610e9b8161100f565b509392505050565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015610efc57507f000000000000000000000000000000000000000000000000000000000000000046145b15610f2657507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b60008082516041036110005760208301516040840151606085015160001a610ff487828585611174565b94509450505050611008565b506000905060025b9250929050565b6000816004811115611023576110236116e4565b0361102b5750565b600181600481111561103f5761103f6116e4565b0361108c5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016106df565b60028160048111156110a0576110a06116e4565b036110ed5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016106df565b6003816004811115611101576111016116e4565b036106f15760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f756500000000000000000000000000000000000000000000000000000000000060648201526084016106df565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156111ab575060009050600361122f565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156111ff573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166112285760006001925092505061122f565b9150600090505b94509492505050565b6001600160a01b03811681146106f157600080fd5b6000806000806080858703121561126357600080fd5b84359350602085013561127581611238565b9250604085013561128581611238565b9396929550929360600135925050565b60008083601f8401126112a757600080fd5b50813567ffffffffffffffff8111156112bf57600080fd5b6020830191508360208260051b850101111561100857600080fd5b600080600080600080600060a0888a0312156112f557600080fd5b87359650602088013561130781611238565b9550604088013567ffffffffffffffff8082111561132457600080fd5b9089019060a0828c03121561133857600080fd5b9095506060890135908082111561134e57600080fd5b61135a8b838c01611295565b909650945060808a013591508082111561137357600080fd5b506113808a828b01611295565b989b979a50959850939692959293505050565b6000602082840312156113a557600080fd5b81356113b081611238565b9392505050565b6000808335601e198436030181126113ce57600080fd5b83018035915067ffffffffffffffff8211156113e957600080fd5b60200191503681900382131561100857600080fd5b634e487b7160e01b600052604160045260246000fd5b6040516080810167ffffffffffffffff81118282101715611437576114376113fe565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715611466576114666113fe565b604052919050565b60008082840360a081121561148257600080fd5b608081121561149057600080fd5b50611499611414565b833581526020808501358183015260408501356040830152606085013560608301528193506080850135915067ffffffffffffffff808311156114db57600080fd5b828601925086601f8401126114ef57600080fd5b823581811115611501576115016113fe565b61151383601f19601f8401160161143d565b9150808252878382860101111561152957600080fd5b80838501848401376000838284010152508093505050509250929050565b600082357ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffea183360301811261157b57600080fd5b9190910192915050565b6000808335601e1984360301811261159c57600080fd5b83018035915067ffffffffffffffff8211156115b757600080fd5b602001915060c08102360382131561100857600080fd5b600060c082840312156115e057600080fd5b60405160c0810181811067ffffffffffffffff82111715611603576116036113fe565b60405282356006811061161557600080fd5b8152602083013561162581611238565b8060208301525060408301356040820152606083013560608201526080830135608082015260a083013561165881611238565b60a08201529392505050565b634e487b7160e01b600052603260045260246000fd5b815160009082906020808601845b838110156116a457815185529382019390820190600101611688565b50929695505050505050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6183360301811261157b57600080fd5b634e487b7160e01b600052602160045260246000fd5b87815260e0810160068810611711576117116116e4565b60208201979097526001600160a01b0395861660408201526060810194909452608084019290925260a083015290911660c090910152919050565b60006020828403121561175e57600080fd5b8135600281106113b057600080fd5b6000808335601e1984360301811261178457600080fd5b83018035915067ffffffffffffffff82111561179f57600080fd5b6020019150600581901b360382131561100857600080fd5b60007f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8311156117e657600080fd5b8260051b80858437919091019392505050565b86815260006020878184015260028710611815576118156116e4565b86604084015285606084015284608084015260c060a084015283518060c085015260005b818110156118555785810183015185820160e001528201611839565b50600060e0828601015260e0601f19601f8301168501019250505097965050505050505056fea164736f6c6343000811000a";

type MultiXConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultiXConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultiX__factory extends ContractFactory {
  constructor(...args: MultiXConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    version: PromiseOrValue<string>,
    signer_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MultiX> {
    return super.deploy(
      name,
      version,
      signer_,
      overrides || {}
    ) as Promise<MultiX>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    version: PromiseOrValue<string>,
    signer_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, version, signer_, overrides || {});
  }
  override attach(address: string): MultiX {
    return super.attach(address) as MultiX;
  }
  override connect(signer: Signer): MultiX__factory {
    return super.connect(signer) as MultiX__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiXInterface {
    return new utils.Interface(_abi) as MultiXInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): MultiX {
    return new Contract(address, _abi, signerOrProvider) as MultiX;
  }
}
