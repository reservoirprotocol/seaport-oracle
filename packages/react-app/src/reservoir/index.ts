import { paths, setParams } from "@reservoir0x/reservoir-kit-client";

const reservoirHost = process.env.RESERVOIR_API_HOST ?? "api";

type OrdersQuery = paths["/tokens/v5"]["get"]["parameters"]["query"];

// Define a function that fetches the flagged tokens.
export async function fetchFlagged(tokensIds: string[]): Promise<Set<string>> {
  // Define the default options for the API request.
  const defaultOptions = { limit: 50 };

  // Construct a URL object that points to the API endpoint.
  const url = new URL(`https://${reservoirHost}.reservoir.tools/tokens/v5`);

  // Define the query parameters for the API request.
  let query: OrdersQuery = { tokens: tokensIds, ...defaultOptions };

  // Add the query parameters to the URL.
  setParams(url, query);

  // Fetch the data from the API.
  const fetchResponse = await fetch(url.href);

  // Parse the response data as JSON.
  const data = await fetchResponse.json();

  // Extract the relevant information from the response data.
  const response = data as paths["/tokens/v5"]["get"]["responses"]["200"]["schema"];

  // Extract the flagged tokens from the response.
  const tokens = response.tokens?.filter(o => o.token && o.token?.isFlagged).map(o => o.token!.tokenId) ?? [];

  // Remove duplicates
  return new Set(tokens);
}
