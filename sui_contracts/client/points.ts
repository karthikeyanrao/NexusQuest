import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromB64 } from "@mysten/bcs";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not defined in .env file');
}
                  
const PACKAGE_ID = "0xea649851809ab93bdea439e54459d6064f16d74e9b9c5d14da1a939c24f6cea5";

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

async function initializePointsIfNeeded(keypair: Ed25519Keypair) {
    try {
        const existingPointsId = await getUserPointsObject(keypair.getPublicKey().toSuiAddress());
        if (existingPointsId) {
            console.log("User points object already exists. Skipping initialization: ", existingPointsId);
            return existingPointsId;
        }

        const tx = new TransactionBlock();
        
        // Call initialize_points function
        tx.moveCall({
            target: `${PACKAGE_ID}::moon_race::initialize_points`,
            arguments: [],
        });

        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            options: { showEffects: true }
        });

        // Wait for transaction to be confirmed
        await client.waitForTransactionBlock({
            digest: result.digest,
        });

        // Get the created object ID from transaction effects
        const newPointsId = result.effects?.created?.[0]?.reference?.objectId;
        if (!newPointsId) {
            throw new Error("Failed to get created points object ID");
        }

        console.log("Points initialized! Object ID:", newPointsId);
        console.log("Transaction digest:", result.digest);
        
        return newPointsId;
    } catch (error) {
        console.error("Error initializing points:", error);
        throw error;
    }
}

async function getUserPointsObject(address: string): Promise<string | null> {
    try {
        const objects = await client.getOwnedObjects({  // Using getOwnedObjects
            owner: address,
            options: {
                showContent: true
            }
        });

        const userPointsObj = objects.data.find((obj: any) => {
            const content = obj.data?.content;
            return content?.type?.includes(`${PACKAGE_ID}::moon_race::UserPoints`);
        });


        return userPointsObj?.data?.objectId || null;
    } catch (error) {
        console.error("Error getting user points object:", error);
        throw error;
    }
}

async function getPointsBalance(address: string) {
    try {        
        const pointsObjectId = await getUserPointsObject(address);
        if (!pointsObjectId) {
            console.log("No points object found. Please initialize first.");
            return null;
        }

        const object = await client.getObject({
            id: pointsObjectId,
            options: {
                showContent: true
            }
        }) as any;

        if (object.data?.content?.dataType === "moveObject") {
            const points = object.data.content.fields.points;
            const suiBalance = object.data.content.fields.sui_balance;
            console.log("\nPoints Balance:");
            console.log("Points:", points);
            console.log("SUI Balance:", suiBalance, "MIST");
            console.log("SUI Balance:", Number(suiBalance) / 1_000_000_000, "SUI");
            return { points, suiBalance };
        }
        
        throw new Error("Invalid object data");
    } catch (error) {
        console.error("Error getting points balance:", error);
        throw error;
    }
}

async function depositPoints(keypair: Ed25519Keypair, amount: bigint) {
    try {
        const address = keypair.getPublicKey().toSuiAddress();
        
        // Get user's points object
        const pointsObjectId = await getUserPointsObject(address);
        if (!pointsObjectId) {
            throw new Error("No points object found. Please initialize first.");
        }

        const tx = new TransactionBlock();
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount)]);
        
        tx.moveCall({
            target: `${PACKAGE_ID}::moon_race::deposit_for_points`,
            arguments: [
                tx.object(pointsObjectId),
                coin
            ],
        });

        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
        });

        // Wait for transaction to be confirmed
        await client.waitForTransactionBlock({
            digest: result.digest,
        });

        console.log("Points deposited! Transaction digest:", result.digest);
        return result;
    } catch (error) {
        console.error("Error depositing points:", error);
        throw error;
    }
}

async function withdrawSui(keypair: Ed25519Keypair, pointsToSpend: number) {
    try {
        console.log(`Withdrawing SUI for ${pointsToSpend} points...`);

        const address = keypair.getPublicKey().toSuiAddress();
        const pointsObjectId = await getUserPointsObject(address);

        const tx = new TransactionBlock();
        
        // Call withdraw_sui function
        tx.moveCall({
            target: `${PACKAGE_ID}::moon_race::withdraw_sui`,
            arguments: [
                tx.object(pointsObjectId),
                tx.pure(pointsToSpend)
            ],
        });

        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            options: { showEffects: true }
        });

        // Wait for transaction confirmation
        await client.waitForTransactionBlock({
            digest: result.digest,
        });

        console.log("Withdrawal successful!");
        console.log("Transaction digest:", result.digest);

        // Calculate and show SUI received
        const suiReceived = (pointsToSpend * 1_000_000_000) / 100; // Based on POINTS_PER_SUI
        console.log("SUI received:", suiReceived / 1_000_000_000, "SUI");

        // Get updated balance
        await getPointsBalance(pointsObjectId);

        return result;
    } catch (error) {
        console.error("Error withdrawing SUI:", error);
        throw error;
    }
}

async function updatePoints(
    keypair: Ed25519Keypair, 
    userPointsId: string,
    pointsToUpdate: number,
    adminCapId: string
) {
    try {
        console.log(`Updating ${pointsToUpdate} points for object ${userPointsId}...`);

        const tx = new TransactionBlock();
        
        // Call update_points function with AdminCap
        tx.moveCall({
            target: `${PACKAGE_ID}::moon_race::update_points`,
            arguments: [
                tx.object(userPointsId),      // UserPoints object
                tx.pure(pointsToUpdate),      // Amount of points to update
            ],
        });

        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            options: { showEffects: true }
        });

        // Wait for transaction confirmation
        await client.waitForTransactionBlock({
            digest: result.digest,
        });

        console.log("Points updated successfully!");
        console.log("Transaction digest:", result.digest);

        // Get updated balance
        await getPointsBalance(userPointsId);

        return result;
    } catch (error) {
        console.error("Error updating points:", error);
        throw error;
    }
}

async function getAdminCapObject(address: string) {
    const objects = await client.getOwnedObjects({  // Using getOwnedObjects
        owner: address,
        options: {
            showContent: true
        }
    });

    return objects.data.find((obj: any) => {
        const content = obj.data?.content;
        return content?.type?.includes(`${PACKAGE_ID}::moon_race::AdminCap`);
    })?.data?.objectId || null;
}
// Example usage
async function main() {
    try {
        // First time only: Initialize points
        const keypair = getWalletKeypair();
        const address = keypair.getPublicKey().toSuiAddress();
        const initResult = await initializePointsIfNeeded(keypair);
        
        // Check balance
        await getPointsBalance(address);

        // Deposit 0.1 SUI for points
        const depositAmount = BigInt(100_000_000); // 0.1 SUI in MIST
        await depositPoints(keypair, depositAmount);

        // Withdraw 50 points (will receive 0.5 SUI based on POINTS_PER_SUI rate)
        await withdrawSui(keypair, 1);

        
        // Check balance
        await getPointsBalance(address);

        

      
        
    } catch (error) {
        console.error("Error in main:", error);
    }
}

main();