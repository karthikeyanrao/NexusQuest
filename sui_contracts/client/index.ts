import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromB64 } from "@mysten/bcs";
import dotenv from 'dotenv';
import { getFullnodeUrl } from '@mysten/sui.js/client';


// Load environment variables
dotenv.config();

if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not defined in .env file');
}

// Contract details
// PackageID: 0x88bcbd09689c6f3aeeba49383457e782acdd44f2b017807f8544d081eaf22508                 │
// │  │ Version: 1                                                                                    │
// │  │ Digest: 2L7wEEPbkcoAxzHJGbugrxWCJRoAs5ADBeV4HGXiGPvC                                          │
// │  │ Modules: moon_race   

//   ┌──                                                                                             │
// │  │ PackageID: 0x52a27f96c0c9e29f3be8edaea55d7c49f9781edee39cc33092e2b19c431b3d45                 │
// │  │ Version: 1                                                                                    │
// │  │ Digest: GKyKLLep1BwHiMXbLKVCHQ17mCwRdYiPsGg6zkThNxwt                                          │
// │  │ Modules: moon_race                                                                          │
// │  └──                        
const PACKAGE_ID = "0x88bcbd09689c6f3aeeba49383457e782acdd44f2b017807f8544d081eaf22508";

const client = new SuiClient({
    url: "https://fullnode.testnet.sui.io:443"
});

function getWalletKeypair(): Ed25519Keypair {
    const privateKeyBase64 = process.env.PRIVATE_KEY;
    if (!privateKeyBase64) {
        throw new Error('Private key not found in environment variables');
    }

    // Convert and clean the private key
    const privateKeyBytes = fromB64(privateKeyBase64);
    const cleanedPrivateKey = privateKeyBytes.length === 33 
        ? privateKeyBytes.slice(1) 
        : privateKeyBytes;

    return Ed25519Keypair.fromSecretKey(cleanedPrivateKey);
}

async function createHelloWorldMessage() {
    try {
        // Create a keypair from your private key
        // Replace with your private key in base64 format
        const keypair = getWalletKeypair();
        console.log("Wallet Address:", `${keypair.getPublicKey().toSuiAddress()}`);

        // Create a new transaction block
        const tx = new TransactionBlock();
        
        // Call the create_message function
        tx.moveCall({
            target: `${PACKAGE_ID}::moon_race::create_message`,
            arguments: [],
        });

        // Sign and execute the transaction
        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
        });

        console.log("Transaction digest:", result.digest);
        
        // Wait for transaction confirmation
        console.log("Waiting for transaction to be confirmed...");
        const txResponse = await client.waitForTransactionBlock({
            digest: result.digest,
            timeout: 30000, // 30 seconds timeout
        });

        // Get transaction details
        const txData = await client.getTransactionBlock({
            digest: result.digest,
            options: {
                showEffects: true,
                showInput: true,
                showEvents: true,
            },
        });

        console.log("\nTransaction confirmed!");
        console.log("Status:", txData.effects?.status?.status);
        console.log("Created Objects:", txData.effects?.created?.map(obj => obj.reference.objectId));
        
        return result;
    } catch (error) {
        console.error("Error creating message:", error);
        throw error;
    }
}

// Execute the function
createHelloWorldMessage()
    .then(result => console.log("Complete!", result))
    .catch(error => console.error("Failed:", error));