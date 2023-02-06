# SEAPORT ORACLE

## Introduction

Seaport oracle is an oracle which implement (SIP7)[https://github.com/ProjectOpenSea/SIPs/blob/main/SIPS/sip-7.md] sub-standard 3.

SIP7 allows extra features to be provided to users via signatures off-chain.

## Use

In order to use this oracle, orders must set the `zone` address to [TODO add deployed address].
Additionally other parameters might be required for each feature.

## Features

### Cancellable Orders

Supported orders can be cancelled by signing an `EIP712` message and post it to the oracle API. Multiple orders can be cancelled in a single batch request.

The user must provide a signature of the array of order hashes to be cancelled.

### Replaceable Orders

Supported orders can be replaced by providing a new order with the same offerer and the previous order's hash in the `salt` field of the replacing order.

Multiple orders can be replaced in a single batch request.

### Flagged Token Protection

Supported orders cannot be filled with flagged tokens.
To enable this feature the order `zoneHash` field must be set to `0x8000000000000000000000000000000000000000000000000000000000000000`

## Cancellation feed

Cancellations are published at the endpoint `GET /cancellations`.
Each cancellation becomes active after the latest fulfillment signature for that order has expired.

## API Docs

The complete API documentation can be found at `/docs`.

## Future and Missing Features

- [ ] Rate limiting
- [ ] Extra validations
  - [ ] Zone address validation
  - [ ] Auth for fulfillers (EIP-4361)
  - [ ] Onchain check for order if already cancelled
