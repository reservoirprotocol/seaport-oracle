import { createClient } from "@reservoir0x/reservoir-kit-client";
import { wallet } from "../src/eth";

const client = createClient({
  apiBase: "https://api-goerli.reservoir.tools",
  //   apiKey: "YOUR_API_KEY",
  source: "myapp.xyz",
});

let listOrder = {
  orderKind: "seaport",
  orderbook: "reservoir",
  automatedRoyalties: true,
  currency: "0x0000000000000000000000000000000000000000",
  token: "0x10b8b56d53bfa5e374f38e6c0830bad4ebee33e6:124",
  weiPrice: "100000000000000000000",
  salt: "123",
};

client.actions.listToken({
  signer: wallet,
  onProgress: () => {},
  //@ts-ignore
  listings: [listOrder],
});
