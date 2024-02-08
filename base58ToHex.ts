const bs58 = require('bs58');
require('dotenv').config({ path: `./env/.env` });

function base58ToBytes32(base58String: string) {
  const bytes = bs58.decode(base58String);
  if (bytes.length !== 32) {
    throw new Error('Base58 string should decode to 32 bytes');
  }
  return Buffer.from(bytes);
}

// Base58 string to convert
const base58String = process.env.TOKEN_MINT; // Replace with your Base58 address

// Convert Base58 string to bytes32
const bytes32Value = base58ToBytes32(base58String!);
console.log(`0x${bytes32Value.toString('hex')}`);
