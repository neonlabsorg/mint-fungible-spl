/*
 * Note! You can update your token metadata only if the Metadata Account isMutable prop set to True.
 * Once flipped to False, it cannot ever be True again.
 *
 */
import { PublicKey } from '@solana/web3.js';
import {
  fetchMetadataFromSeeds,
  mplTokenMetadata,
  updateMetadataAccountV2
} from '@metaplex-foundation/mpl-token-metadata';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { buildAndSendTransaction, setupUmiClient } from './utils/setupClient';
import metadata from './metadata/updateToken.json';

require('dotenv').config({ path: `./env/.env` });

const umi = setupUmiClient().umi;
const TOKEN_MINT = process.env.TOKEN_MINT!;

//Install the mplTokenMetadata plugin
umi.use(mplTokenMetadata());

const updateMetadataAccountForToken = async (offChainMetadata: any) => {
  const metadata = await fetchMetadataFromSeeds(umi, {
    mint: fromWeb3JsPublicKey(new PublicKey(TOKEN_MINT))
  });

  const updateMetadataAccountV2Args = {
    metadata: fromWeb3JsPublicKey(new PublicKey(metadata.publicKey)), //Replace with the PublicKey or PDA of the metadata account you want to update
    updateAuthority: umi.identity,
    data: {
      name: offChainMetadata.name,
      symbol: offChainMetadata.symbol,
      uri: offChainMetadata.image, //Replace with the actual URL of the metadata uploaded on publicly accessible storage
      sellerFeeBasisPoints: 0,
      creators: metadata.creators, //Verified creators couldn't be changed
      collection: null,
      uses: null
    }
  };

  const instruction = updateMetadataAccountV2(umi, updateMetadataAccountV2Args);

  await buildAndSendTransaction(umi, instruction);
};

(async () => {
  await updateMetadataAccountForToken(metadata);
})();
