"use client";

import { useState, useEffect } from "react";
import { getContract } from "@/utils/token"; // Ensure the path is correct
import { ethers } from "ethers";

const TokenTransfer = ({ userAddress }) => {
    const [balance, setBalance] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [transferStatus, setTransferStatus] = useState("");
    const [error, setError] = useState("");

    // Function to load the user's token balance
    const loadBalance = async () => {
        if (!userAddress) {
            setError("User address not provided");
            return;
        }
        try {
            console.log("Fetching contract...");
            const contract = await getContract();
            console.log("Contract loaded:", contract);
            const rawBalance = await contract.balanceOf(userAddress);
            const formattedBalance = ethers.formatUnits(rawBalance, 18); // Assuming 18 decimals
            setBalance(formattedBalance);
            setError("");
        } catch (err) {
            console.error("Error fetching balance:", err);
            setError(err.message || "Error fetching balance");
        }
    };

    useEffect(() => {
        loadBalance();
    }, [userAddress]);

    // Function to handle token transfer
    const handleTransfer = async () => {
        if (!recipient || !amount) {
            setError("Please provide recipient address and amount");
            return;
        }
        try {
            const contract = await getContract();
            const amountInWei = ethers.parseUnits(amount, 18);
            const tx = await contract.transfer(recipient, amountInWei);
            setTransferStatus("Transaction submitted. Waiting for confirmation...");
            await tx.wait();
            setTransferStatus("Transfer successful!");
            loadBalance(); // Refresh balance after transfer
        } catch (err) {
            console.error("Error during transfer:", err);
            setError(err.message || "Error during transfer");
            setTransferStatus("");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md mt-10 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-center text-black">
                Token Transfer System
            </h2>
            <p className="text-center mb-6 text-black">
                Your Balance: {balance !== null ? `${balance} Tokens` : "Loading..."}
            </p>
            <div className="mb-4">
                <label htmlFor="recipient" className="block mb-1 text-black font-medium">
                    Recipient Address
                </label>
                <input
                    id="recipient"
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full border text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="amount" className="block mb-1 text-black font-medium">
                    Amount
                </label>
                <input
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                onClick={handleTransfer}
                className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition-colors"
            >
                Transfer Tokens
            </button>
            {transferStatus && (
                <p className="mt-4 text-center text-blue-600">{transferStatus}</p>
            )}
            {error && (
                <p className="mt-4 text-center text-red-500">{error}</p>
            )}
        </div>
    );
};

export default TokenTransfer;
