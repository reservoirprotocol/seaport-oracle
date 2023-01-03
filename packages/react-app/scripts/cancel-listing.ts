import { chainId, wallet } from "../src/eth";
import { CANCEL_REQUEST_EIP712_TYPE, EIP712_DOMAIN } from "../src/types/types";

async function send() {
  const orderHashes = ["0x73096d5746cd1862d65ff4b79b9a95811ab6baf34fb280dc0e85570c00115d1f"];
  const signature = await wallet._signTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, {
    orderHashes,
  });

  const rawResponse = await fetch("http://localhost:3000/api/cancellations", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderHashes, signature }),
  });
  const content = await rawResponse.json();

  console.log(content);
}

send();
