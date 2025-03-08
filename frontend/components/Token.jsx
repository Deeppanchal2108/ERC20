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
        <div className="max-w-md mx-auto p-8 bg-gradient-to-br mt-16 from-slate-50 to-slate-100 rounded-xl shadow-lg border border-slate-200">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Token Transfer</h2>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">Your Balance</p>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <span className="font-mono font-semibold text-slate-800">
                            {balance !== null ? `${balance} Tokens` : "Loading..."}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-slate-700 mb-2">
                        Recipient Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-slate-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .54.286 1.036.75 1.3l2.96 1.686c.421.24.919.24 1.34 0l3.96-2.26a.75.75 0 01.75 0l3.96 2.26a1.5 1.5 0 002.09-.55l2.028-4.055a1 1 0 00-.363-1.118l-7-3.5z" />
                            </svg>
                        </div>
                        <input
                            id="recipient"
                            type="text"
                            placeholder="0x..."
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                        Amount
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-slate-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            id="amount"
                            type="number"
                            placeholder="0.0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={handleTransfer}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Transfer Tokens</span>
                </button>
            </div>

            {transferStatus && (
                <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {transferStatus}
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TokenTransfer;
