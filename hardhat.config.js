require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_RPC, // Use Alchemy or Infura RPC
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
  },
};
