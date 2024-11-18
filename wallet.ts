import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { writeFile } from 'fs';

require('dotenv').config({ path: `./env/.env` });

//STEP 1 - Connect to Solana Network
const endpoint = process.env.SOLANA_URL; //Replace with your Solana RPC Endpoint
const solanaConnection = new Connection(endpoint!);

//STEP 2 - Generate a New Solana Wallet
const keypair = Keypair.generate();
console.log(`Generated new KeyPair. Wallet PublicKey: `, keypair.publicKey.toString());

//STEP 3 - Convert Private key to Base58
// const privateKey = bs58.encode(keypair.secretKey);

//STEP 4 - Write Wallet Secret Key to a .JSON
const secret_array = Array.from(keypair.secretKey);
const secret = JSON.stringify(secret_array); //Covert to JSON string

writeFile('secret.json', secret, 'utf8', (err) => {
  if (err) throw err;
  console.log('Wrote secret key to secret.json.');
});

//STEP 5 - Airdrop 1 SOL to new wallet
(async () => {
  try {
    const signature = await solanaConnection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
    console.log(`Airdrop Transaction Id: ${signature}`);
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=${endpoint}`);
  } catch (err) {
    console.log(err);
  }
})();
