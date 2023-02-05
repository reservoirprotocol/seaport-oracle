import { paths, setParams } from "@reservoir0x/reservoir-kit-client";

const reservoirHost = process.env.RESERVOIR_API_HOST ?? "api";

type OrdersQuery = paths["/tokens/v5"]["get"]["parameters"]["query"];

export async function fetchFlagged(tokensIds: string[]): Promise<Set<string>> {
  const defaultOptions = { limit: 50 };
  const url = new URL(`https://${reservoirHost}.reservoir.tools/tokens/v5`);
  let query: OrdersQuery = { tokens: tokensIds, ...defaultOptions };
  setParams(url, query);

  const fetchResponse = await fetch(url.href);
  const data = await fetchResponse.json();

  const response = data as paths["/tokens/v5"]["get"]["responses"]["200"]["schema"];

  const tokens = response.tokens?.filter(o => o.token && o.token?.isFlagged).map(o => o.token!.tokenId) ?? [];
  return new Set(tokens);
}
