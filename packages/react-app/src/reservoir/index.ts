import { paths, setParams } from "@reservoir0x/reservoir-kit-client";
import { Types } from "@reservoir0x/sdk/dist/seaport";
import * as Sdk from "@reservoir0x/sdk";
import { chainId } from "../eth";

const reservoirHost = process.env.RESERVOIR_API_HOST ?? "api";

type OrdersQuery = paths["/orders/asks/v4"]["get"]["parameters"]["query"];

export async function getOrders(ids: string[]): Promise<Sdk.Seaport.Order[]> {
  const defaultOptions = { limit: 50, includeRawData: true, status: "active" };
  const url = new URL(`https://${reservoirHost}.reservoir.tools/orders/asks/v4`);
  // Bug in library ids can only be string
  //@ts-ignore
  let query: OrdersQuery = { ids, ...defaultOptions };
  setParams(url, query);

  const fetchResponse = await fetch(url.href);
  const data = await fetchResponse.json();

  const response = data as paths["/orders/asks/v4"]["get"]["responses"]["200"]["schema"];

  const orders =
    response.orders
      ?.filter(o => o.kind === "seaport")
      .map(o => new Sdk.Seaport.Order(chainId, o.rawData as Types.OrderComponents)) ?? [];
  return orders;
}
