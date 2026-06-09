import { isConnected, requestAccess, getAddress } from "@stellar/freighter-api";

export async function connectFreighter(): Promise<boolean> {
  try {
    const connection = await isConnected();

    if (!connection.isConnected) {
      throw new Error("Freighter wallet is not installed");
    }

    const access = await requestAccess();

    if (access.error) {
      throw new Error(access.error);
    }

    return true;
  } catch (error) {
    console.error("Failed to connect Freighter:", error);
    return false;
  }
}

export async function retrievePublicKey(): Promise<string> {
  try {
    const { address } = await getAddress();

    if (!address) {
      throw new Error("Unable to retrieve wallet address");
    }

    return address;
  } catch (error) {
    console.error("Failed to retrieve public key:", error);
    throw error;
  }
}

export function shortenPublicKey(address: string): string {
  if (!address || address.length < 8) {
    return address;
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
