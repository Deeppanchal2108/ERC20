"use client";

import { useState, useEffect } from "react";
import { getContract } from "@/utils/token";// Ensure the path is correct

const Token = ({ userAddress }) => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBalance = async () => {
            if (!userAddress) {
                setError("User address not provided");
                return;
            }

            try {
                const balance = await getBalance(userAddress);
                setBalance(balance);
                setError("");
            } catch (err) {
                setError(err.message || "Error fetching balance");
            }
        };

        loadBalance();
    }, [userAddress]);

    return (
        <div>
            <h2>Token Balance</h2>
            {error ? <p style={{ color: "red" }}>{error}</p> : <p>Balance: {balance}</p>}
        </div>
    );
};

export default Token;
