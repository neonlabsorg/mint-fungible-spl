/*
 * This creates and initializes a new Metadata account for a given Mint account.
 * It is required that the Mint account has been created and initialized
 * by the Token Program before executing this instruction.
 * If you have already created the Metadata account, you should use the updateTokenMetadata.ts instruction instead.
 */
import { PublicKey } from "@solana/web3.js";
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { buildAndSendTransaction, setupUmiClient } from "./utils/setupClient";

require('dotenv').config({ path: `./env/.env` });

const umi = setupUmiClient().umi;
const userWalletSigner = setupUmiClient().userWalletSigner;

umi.payer = userWalletSigner;

const createMetadataAccountForToken = async (offChainMetadata: any) => {
  const createMetadataAccountV3Args = {
    mint: fromWeb3JsPublicKey(new PublicKey(process.env.TOKEN_MINT!)), //Replace with your own token mint
    mintAuthority: umi.identity,
    payer: userWalletSigner,
    updateAuthority: umi.identity,
    data: {
      name: offChainMetadata.name,
      symbol: offChainMetadata.symbol,
      uri: "https://ipfs.io/ipfs/QmNunKefNdgQh6XHCAqcjcta5uxf9gaNGWvJPahQsxGjHb", //Replace with the actual URL of the metadata uploaded on publicly accessible storage
      sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
  },
  isMutable: false, //if this field is set to False, it cannot be changed back to True
  collectionDetails: null,
}

  const instruction = createMetadataAccountV3(
    umi,
    createMetadataAccountV3Args
  )

  await buildAndSendTransaction(umi, instruction);
}


(async() => {
  const offChainMetadata = { // you can get it from the token.json file
    name: "Very Cool Token",
    symbol: "VVCT",
    description: "Updated token",
    image: "https://ipfs.io/ipfs/QmdtTgrzL7tJk7NeAq6wwJEfXidEiV8usUmCjTw8Qqm4HD" //Replace with the actual URL of the token icon uploaded on publicly accessible storage
  }
  await createMetadataAccountForToken(offChainMetadata);
})()
