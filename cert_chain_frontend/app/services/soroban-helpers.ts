import {
  getAddress,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Account,
  BASE_FEE,
  Operation,
  Server,
  TransactionBuilder,
  Networks,
  xdr,
} from "soroban-client";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://rpc-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE ||
  Networks.TESTNET;
const CONTRACT_ID = "CADJTVJ3B2L4RGKMQM33GHG7ISA7IJXQITZJB2X2XZTRH3XZDOSAYIAR";
const CONTRACT_FUNCTION = "issue_cert";

export async function sendHashToSmartContract(hash: string) {
  if (!hash) {
    throw new Error("Certificate hash is required.");
  }

  if (!CONTRACT_ID) {
    throw new Error(
      "Missing STELLAR_CONTRACT_ID environment variable.",
    );
  }

  if (!RPC_URL) {
    throw new Error("Missing STELLAR_RPC_URL environment variable.");
  }

  const connection = await isConnected();
  if (!connection.isConnected) {
    throw new Error("Freighter wallet is not connected.");
  }

  const access = await requestAccess();
  if (access.error) {
    throw new Error(access.error);
  }

  const { address } = await getAddress();
  if (!address) {
    throw new Error("Unable to retrieve wallet address from Freighter.");
  }

  const server = new Server(RPC_URL, {
    allowHttp: RPC_URL.startsWith("http://"),
  });

  const sourceAccount = await server.getAccount(address);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE.toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: CONTRACT_FUNCTION,
        args: [xdr.ScVal.scvString(hash)],
        source: address,
      }),
    )
    .setTimeout(180)
    .build();

  const signed = await signTransaction(transaction.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address,
  });

  if (signed.error) {
    throw new Error(signed.error);
  }

  const signedXdr = signed.signedTxXdr;
  if (!signedXdr) {
    throw new Error("Freighter did not return a signed transaction.");
  }

  const result = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE),
  );
  return result.hash;
}
