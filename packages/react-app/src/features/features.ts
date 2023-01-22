import { arrayify } from "ethers/lib/utils";

export class Features {
  zoneHashBytes: Uint8Array;

  constructor(zoneHash: string) {
    this.zoneHashBytes = arrayify(zoneHash);
  }

  checkFlagged(): boolean {
    return ((this.zoneHashBytes[0] >> 7) & 1) === 1;
  }
}
