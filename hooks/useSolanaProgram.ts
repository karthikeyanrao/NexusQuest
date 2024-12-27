// import { Program } from "@coral-xyz/anchor";
// import { useMemo } from "react";
// import * as anchor from "@coral-xyz/anchor";
// import { BN } from "@coral-xyz/anchor";
// import { Solana } from "@/contracts/nexusquest";
// import IDL from "./nexusquest";
// import { Transaction, PublicKey, ComputeBudgetProgram } from "@solana/web3.js";
// import {
//   createAssociatedTokenAccountInstruction,
//   getAssociatedTokenAddressSync,
//   TOKEN_PROGRAM_ID,
// } from "@solana/spl-token";
// import { Connection } from "@solana/web3.js";

// export const SOLANA_PROGRAM_ID = (IDL as Solana).address;
// const lifafaProgramId = new PublicKey(SOLANA_PROGRAM_ID);
// export const SOLANA_SEED = "lifafa";

// export enum ClaimMode {
//   Random = 0,
//   Equal = 1,
// }

// export function useSolanaProgram() {
//   const connection = new Connection("https://api.devnet.solana.com");
//   const anchorWallet = useAnchorWallet();

//   const provider = useMemo(() => {
//     return new anchor.AnchorProvider(connection, anchorWallet!, {
//       preflightCommitment: "processed",
//     });
//   }, [connection, anchorWallet]);

//   const program = useMemo(() => {
//     if (!provider) {
//       return null;
//     }
//     return new Program<Solana>(IDL as Solana, provider);
//   }, [provider]);

//   async function createSolana(
//     id: number,
//     amount: number,
//     timeLimit: number,
//     maxClaims: number,
//     ownerName: string,
//     desc: string,
//     claimMode: ClaimMode,
//     mint: PublicKey,
//     walletPublicKey: anchor.web3.PublicKey,
//   ): Promise<anchor.web3.Transaction> {
//     console.log(`\nCreate Envelope, amount = ${amount}, id = ${id}`);
//     if (!program) {
//       throw new Error("Program not initialized");
//     }
//     if (!walletPublicKey) {
//       throw new Error("Wallet not initialized");
//     }
//     if (!provider) {
//       throw new Error("Provider not initialized");
//     }
//     try {
//       const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
//         microLamports: 15000,
//       });
//       const txn = new Transaction().add(addPriorityFee);

//       const [lifafaPDA] = getSolanaPDA(id);
//       console.log("lifafa", lifafaPDA.toString());

//       const vault = getAssociatedTokenAddressSync(mint, lifafaPDA, true);
//       const vaultAccountInfo = await connection.getAccountInfo(vault);
//       if (vaultAccountInfo === null) {
//         console.log("No vault account info creating one");
//         txn.add(
//           createAssociatedTokenAccountInstruction(
//             walletPublicKey,
//             vault,
//             lifafaPDA,
//             mint,
//           ),
//         );
//       }
//       const createSolanaInstruction = await program.methods
//         .createSplSolana(
//           new anchor.BN(id),
//           new anchor.BN(amount),
//           new anchor.BN(timeLimit),
//           new anchor.BN(maxClaims),
//           ownerName,
//           desc,
//           claimMode,
//         )
//         .accounts({
//           mint: mint,
//           vault: vault,
//           signer: walletPublicKey,
//           tokenProgram: TOKEN_PROGRAM_ID,
//         })
//         .instruction();
//       txn.add(createSolanaInstruction);

//       txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//       txn.feePayer = walletPublicKey;
//       return txn;
//     } catch (error) {
//       console.error("Create Solana Transaction error", error);
//       throw error;
//     }
//   }

//   async function claimSolana(
//     id: any,
//     walletPublicKey: anchor.web3.PublicKey,
//   ): Promise<anchor.web3.Transaction> {
//     console.log("\nClaiming Envelope id: ", id);
//     if (!program) {
//       throw new Error("Program not initialized");
//     }
//     if (!walletPublicKey) {
//       throw new Error("Wallet not initialized");
//     }
//     if (!provider) {
//       throw new Error("Provider not initialized");
//     }
//     try {
//       const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
//         microLamports: 15000,
//       });
//       const txn = new Transaction().add(addPriorityFee);
//       const [lifafaPDA] = getSolanaPDA(id);
//       const data = await program.account.lifafa.fetch(lifafaPDA);
//       const mint = data.mintOfTokenBeingSent;
//       const vault = getAssociatedTokenAddressSync(mint, lifafaPDA, true);
//       const ata = getAssociatedTokenAddressSync(mint, walletPublicKey);
//       const accountInfo = await connection.getAccountInfo(ata);
//       if (accountInfo === null) {
//         console.log("No ata account info creating one");
//         txn.add(
//           createAssociatedTokenAccountInstruction(
//             walletPublicKey,
//             ata,
//             walletPublicKey,
//             mint,
//           ),
//         );
//       } else {
//         console.log("Vault account is there");
//       }
//       const instruction = await program.methods
//         .claimSplSolana(new anchor.BN(id))
//         .accounts({
//           mint: mint,
//           vault: vault,
//           signer: walletPublicKey,
//           tokenProgram: TOKEN_PROGRAM_ID,
//         })
//         .instruction();
//       txn.add(instruction);
//       txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//       txn.feePayer = walletPublicKey;
//       return txn;
//     } catch (error) {
//       console.error("Claim Solana Transaction error", error);
//       throw error;
//     }
//   }

//   async function deleteSolana(
//     id: any,
//     walletPublicKey: anchor.web3.PublicKey,
//   ): Promise<anchor.web3.Transaction> {
//     console.log("\nDeleting Envelope id: ", id);
//     if (!program) {
//       throw new Error("Program not initialized");
//     }
//     if (!walletPublicKey) {
//       throw new Error("Wallet not initialized");
//     }
//     if (!provider) {
//       throw new Error("Provider not initialized");
//     }
//     try {
//       const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
//         microLamports: 15000,
//       });
//       const txn = new Transaction().add(addPriorityFee);
//       const [lifafaPDA] = getSolanaPDA(id);
//       const data = await program.account.lifafa.fetch(lifafaPDA);
//       const mint = data.mintOfTokenBeingSent;
//       const vault = getAssociatedTokenAddressSync(mint, lifafaPDA, true);    
//       const instruction = await program.methods
//         .deleteSplSolana(new anchor.BN(id))
//         .accounts({
//           mint: mint,
//           vault: vault,
//           signer: walletPublicKey,
//           tokenProgram: TOKEN_PROGRAM_ID,
//         })
//         .instruction();
//       txn.add(instruction);
//       txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//       txn.feePayer = walletPublicKey;
//       return txn;
//     } catch (error) {
//       console.error("Claim Solana Transaction error", error);
//       throw error;
//     }
//   }

//   function getSolanaPDA(lifafaId: any) {
//     return anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from(SOLANA_SEED), new BN(lifafaId).toArrayLike(Buffer, "le", 8)],
//       lifafaProgramId,
//     );
//   }

//   async function fetchSolana(id: number) {
//     if (!program) {
//       throw new Error("Program not initialized");
//     }
//     if (!provider) {
//       throw new Error("Provider not initialized");
//     }
//     try {
//       const [lifafaPDA] = getSolanaPDA(id);
//       const lifafaAccount = await program.account.lifafa.fetch(lifafaPDA);
//       return lifafaAccount;
//     } catch (error) {
//       console.error("Error fetchSolana:", error);
//       return null;
//     }
//   }

//   const value = useMemo(
//     () => ({
//       createSolana,
//       claimSolana,
//       getSolanaPDA,
//       fetchSolana,
//       deleteSolana,
//       program,
//     }),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [program],
//   );

//   return value;
// }
