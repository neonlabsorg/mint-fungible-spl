/*
 * Setup Umi client, you can choose to use the default Umi client or create your own
 */
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromKeypair, signerIdentity, TransactionBuilder, Umi } from '@metaplex-foundation/umi';
import bs58 from 'bs58';
import secret from '../secret.json';

require('dotenv').config({ path: `./env/.env` });

const SOLANA_URL = process.env.SOLANA_URL!;

export function setupUmiClient() {
  const umi = createUmi(SOLANA_URL); //Replace with your Solana RPC Endpoint

  //Initialize the wallet from the secret and making it the signer for transactions
  const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
  const userWalletSigner = createSignerFromKeypair(umi, userWallet);

  //Ask the umi client to use our wallet initialized earlier from secret as a signer
  umi.use(signerIdentity(userWalletSigner));

  return { umi, userWallet, userWalletSigner };
}

export async function buildAndSendTransaction(umi: Umi, instruction: TransactionBuilder): Promise<void> {
  const transaction = await instruction.buildAndSign(umi);

  const transactionSignature = await umi.rpc.sendTransaction(transaction);
  const signature = bs58.encode(transactionSignature);
  console.log(`Transaction Id: ${signature}`);
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=custom&clusterUrl=${SOLANA_URL}`);
}
