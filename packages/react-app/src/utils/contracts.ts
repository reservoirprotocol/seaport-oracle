export type Contracts = {
  cancellationZone: string;
};

export const CONTRACT_ADDRESSES: Record<number, Contracts> = {
  [1]: {
    cancellationZone: "0xaa0e012d35cf7d6ecb6c2bf861e71248501d3226",
  },
  [5]: {
    cancellationZone: "0x49b91d1d7b9896d28d370b75b92c2c78c1ac984a",
  },
  [137]: {
    cancellationZone: "0xfb2b693819e866ec87e574903f6e4943723c8ff7",
  },
  [80001]: {
    cancellationZone: "0xfb2b693819e866ec87e574903f6e4943723c8ff7",
  },
};
