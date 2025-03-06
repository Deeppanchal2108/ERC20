require("dotenv").config();
const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());

    const MyToken = await ethers.getContractFactory("MyToken");

    // ✅ Pass initial supply as an argument
    const initialSupply = ethers.parseUnits("1000", 18); // 1000 tokens (18 decimals)
    const token = await MyToken.deploy(initialSupply, {
        gasLimit: 3000000, // Optional: specify gas limit
    });

    await token.waitForDeployment();
    console.log("Token deployed at:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
