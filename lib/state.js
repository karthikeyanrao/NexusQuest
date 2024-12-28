import { atom } from "jotai";

// Writable atom to store the wallet address
export const walletAddressAtom = atom("");

// Derived atom to fetch wallet address asynchronously (initial fetch)
export const walletAddressAsyncAtom = atom(async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0]; // Return the wallet address
    } catch (error) {
      console.error("Error fetching wallet address:", error);
      return ""; // Return empty if there's an error
    }
  }
  console.error("MetaMask is not available.");
  return ""; // Return empty if MetaMask is not available
});

// Synchronize walletAddressAtom with walletAddressAsyncAtom
export const syncedWalletAddressAtom = atom(
  (get) => get(walletAddressAsyncAtom),
  (get, set, newValue) => set(walletAddressAtom, newValue)
);
