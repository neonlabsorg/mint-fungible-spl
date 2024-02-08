import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import  "@solana/web3.js";
import secret from './secret.json';

require('dotenv').config({ path: `./env/.env` });

const umi = createUmi(process.env.SOLANA_URL!); //Replace with your Solana RPC Endpoint

//Initialize the wallet from the secret and making it the signer for transactions
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
  name: "Awesome Token",
  symbol: "SNED",
  uri: "https://ipfs.io/ipfs/QmdCQ63AhRdiHHvBGxkvo5eMmxrweXdkgZEw6ifeq2KEkP", //Replace with the actual URL of your metadata (token.json)
};

//Create a new Mint PDA
const mint = generateSigner(umi);
//Ask the umi client to use our wallet initialized earlier from secret as a signer
umi.use(signerIdentity(userWalletSigner));
//Use Candy Machine to mint tokens
umi.use(mplCandyMachine())

//Send a transaction to deploy the Mint PDA and mint 1 million of our tokens
createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9,
  amount: 1000000_000000000,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi).then(() => {
  console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
});

