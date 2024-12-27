const hre = require("hardhat");

async function main() {
    const NFT = await hre.ethers.getContractFactory("MyNFT");
    const nft = await NFT.deploy();

    await nft.deployed();
    console.log("NFT Contract deployed to:", nft.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
