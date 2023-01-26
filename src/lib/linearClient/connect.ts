import { LinearClient } from "@linear/sdk";

interface Params {
  apiKey: string;
}

export function connect({
  apiKey
}: Params) {
  try {
    const linearClient = new LinearClient({ apiKey });
    const graphQLClient = linearClient.client;

    return graphQLClient;
  } catch {
    throw new Error('Failed to connect to linear client!')
  }
}