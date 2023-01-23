import { insertCancellation, getSignatureTrackingExpiration } from "../../persistence/mongodb";
import { getTimestamp } from "../../utils/time";

export async function cancelOrder(owner: string, orderHash: string) {
  const expiration = await getSignatureTrackingExpiration(orderHash);
  let timestamp = getTimestamp();
  timestamp = expiration && expiration > timestamp ? expiration : timestamp;
  await insertCancellation({ orderHash, owner: owner, timestamp });
  return timestamp;
}
