export type CancelXContracts = {
  cancelXZone: string;
};

export const CONTRACT_ADDRESSES: Record<number, CancelXContracts> = {
  [1]: {
    cancelXZone: "0x000000000000000000000000000000000000dEaD",
  },
  [5]: {
    cancelXZone: "0x601D58906d22CE2FabdFB112E15e515557aA191C",
  },
};
