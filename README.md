# Examples of Fungible SPL token creation with Metaplex Foundation Umi framework

**NOTE**

The package uses 

[Metaplex Foundation](https://github.com/metaplex-foundation) library.

[Umi](https://github.com/metaplex-foundation/umi) A JavaScript framework to build Solana clients.

Please check [Metaplex docs](https://docs.metaplex.com/) for more information.

---

## Installation and setup

Firstly, install all necessary packages:

```sh
yarn install
#or
npm install
```

Add .env file with the following content in env directory:

```javascript
SOLANA_URL='XXXXXXXXXXXXXXXXX'
```

## Signer wallet configuration

You can use the following command to create a signer wallet:

```sh
yarn ts-node wallet.ts
```

With this, a new wallet will be created, and your private key will be saved in the secret.json file. Afterward, you can utilize this wallet for additional operations and import it into the wallet of your choice (ex.Phantom).


Alternatively, you can export your existing private key and place it in the secret.json file that you've created yourself.

## Usage

### Usecases:
- [Create and mint token with Metadata](#mint-token-with-metadata)
- [Create token Metadata](#create-token-metadata)
- [Update token Metadata](#update-token-metadata)

<a name="mint"></a>
#### Mint token with metadata
To create and mint your own token, you'll need a token icon and metadata that are publicly accessible.
You can use [IPFS](https://docs.ipfs.tech/install/command-line/) for this purpose or another publicly accessible storage solution.

Create a new metadata JSON file (token.json) following [Metaplex's Fungible Standard](https://docs.metaplex.com/programs/token-metadata/token-standard#the-fungible-standard)

```json
{
  "name": "Your Token Name",
  "symbol": "Your Token Symbol",
  "description": "Your Token Description",
  "image": "Public Token Icon Image URL"
}
```

Upload this file to IPFS and save the CID - (your publicly accessible URL will be like this: https://ipfs.io/ipfs/CID). Or choose your own publicly accessible storage solution. Your token icon image also should be uploaded on publicly accessible storage.

Afterward, you need to put your metadata URL in the mint.ts file.

```javascript
const metadata = {
  name: 'Your Token Name',
  symbol: 'Your Token Symbol',
  uri: 'Your Metadata URL'
};
```

Update the values of **createAndMint** function from mint.ts file with your own values:

```javascript
createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 8, //Choose the number of decimals
  amount: 1000000_00000000, //Choose the amount of tokens you want to mint
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
})
```

To mint a new token, use the following command:

```sh
yarn ts-node mint.ts
```

Add you created token mint address to the .env file

```javascript
TOKEN_MINT='XXXXXXXXXXXXXXXXX'
```

You will need it further to create an ERC20ForSPL token address.

<a name="create"></a>
#### Create token metadata

If you already have your own token but lack metadata, you can create it using the following command:

```sh
yarn ts-node createTokenMetadata.ts
```

See the example from the createTokenMetadata.ts file.

<a name="update"></a>
#### Update token metadata

If you want to update your token metadata, you can use the following command:

```sh
yarn ts-node updateTokenMetadata.ts
```

See the example from the updateTokenMetadata.ts file. Ensure that the **isMutable** field of the metadata is set to true; otherwise, you won't be able to update it. Once it's set to false, it can't be reverted anymore.


## ERC20ForSPL token creation

In order to register a new token in the system factory contract, you will need to follow these steps:

- Decode address of spl-token to hex format with 0x prefix. You can use the following command:

    ```sh
    yarn ts-node base58ToHex.ts
    ```
  
    Or you can use an external service [https://incoherency.co.uk/base58](https://incoherency.co.uk/base58)

  
- Afterward, you need to call [factory contract](https://neonscan.org/address/0x6B226a13F5FE3A5cC488084C08bB905533804720#contract) method **CreateErc20ForSpl** passing SPL token address in hex format. Be sure to use the correct contract address:

    ```javascript
    FACTORY_ADDRESS_MAINNET=0x6B226a13F5FE3A5cC488084C08bB905533804720 //on the mainnet
    FACTORY_ADDRESS_DEVNET=0xF6b17787154C418d5773Ea22Afc87A95CAA3e957 //on the devnet
    ```
  
- Create a pull request to add your tokens to the [Neon Labs token list repository](https://github.com/neonlabsorg/token-list). This PR should include the logo in .svg format and a description for the token, following the format described in the MetaPlex metadata. You should use the chainId: **245022934** (for mainnet).
**Important: version should not be changed!**


- Be patient and wait for pull request to be approved.

**Ask for our Notion page with more detailed instructions.**








