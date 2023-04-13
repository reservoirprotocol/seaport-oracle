import { ReceivedItem } from "@reservoir0x/sdk/dist/seaport-base/types";
import { fetchFlagged } from "../../reservoir";

export class FlaggingChecker {
  private considerations: ReceivedItem[][];
  private flaggedTokensIds?: Set<string>;
  constructor(considerations: ReceivedItem[][]) {
    this.considerations = considerations;
  }

  async containsFlagged(consideration: ReceivedItem[]): Promise<boolean> {
    if (!this.flaggedTokensIds) {
      this.flaggedTokensIds = await this.getFlagged();
    }
    for (let i = 0; i < consideration.length; i++) {
      if (this.flaggedTokensIds.has(`${consideration[i].token}:${consideration[i].identifier}`)) {
        return true;
      }
    }
    return false;
  }

  private async getFlagged() {
    const tokenIds = this.considerations.flat().map(cons => `${cons.token}:${cons.identifier}`);
    return await fetchFlagged(tokenIds);
  }
}
