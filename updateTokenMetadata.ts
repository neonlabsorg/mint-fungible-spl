/*
 * Note! You can update your token metadata only if the Metadata Account isMutable prop set to True.
 * Once flipped to False, it cannot ever be True again.
 *
 */
import { PublicKey } from "@solana/web3.js";
import { mplTokenMetadata, fetchMetadataFromSeeds } from "@metaplex-foundation/mpl-token-metadata";
import { updateMetadataAccountV2 } from "@metaplex-foundation/mpl-token-metadata";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { setupUmiClient, buildAndSendTransaction } from "./utils/setupClient";

require('dotenv').config({ path: `./env/.env` });

const umi = setupUmiClient().umi;

//Install the mplTokenMetadata plugin
umi.use(mplTokenMetadata());

const updateMetadataAccountForToken = async (offChainMetadata: any) => {
  const metadata = await fetchMetadataFromSeeds(umi, {
    mint: fromWeb3JsPublicKey(new PublicKey(process.env.TOKEN_MINT!))
  });

  const updateMetadataAccountV2Args = {
    metadata: fromWeb3JsPublicKey(new PublicKey(metadata.publicKey)), //Replace with the PublicKey or PDA of the metadata account you want to update
    updateAuthority: umi.identity,
    data: {
      name: offChainMetadata.name,
      symbol: offChainMetadata.symbol,
      uri: "https://ipfs.io/ipfs/QmNunKefNdgQh6XHCAqcjcta5uxf9gaNGWvJPahQsxGjHb", //Replace with the actual URL of the metadata uploaded on publicly accessible storage
      sellerFeeBasisPoints: 0,
      creators: metadata.creators, //Verified creators couldn't be changed
      collection: null,
      uses: null
    }
  }

  const instruction = updateMetadataAccountV2(
    umi,
    updateMetadataAccountV2Args
  )

  await buildAndSendTransaction(umi, instruction);
}

(async() => {
  const offChainMetadata = { // you can get it from the metadata/token.json file
    name: "Very Cool Fungible Token",
    symbol: "VVCT",
    description: "Updated token",
    image: "https://ipfs.io/ipfs/QmdtTgrzL7tJk7NeAq6wwJEfXidEiV8usUmCjTw8Qqm4HD" //Replace with the actual URL of the token icon uploaded on publicly accessible storage
  }
  await updateMetadataAccountForToken(offChainMetadata);
})()



