"use client";

import React, { useEffect, useState } from "react";
import Token from "@/components/Token";

function Page() {
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    const getAccount = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          console.log("Accounts found:", accounts);
          if (accounts.length > 0) {
            setUserAddress(accounts[0]); // Set the first connected account
          }
        } catch (error) {
          console.error("Error fetching account:", error);
        }
      } else {
        console.error("MetaMask not detected");
      }
    };

    getAccount();
  }, []);

  return (
    <div>
      {userAddress ? <Token userAddress={userAddress} /> : <p>Connect your wallet</p>}
    </div>
  );
}

export default Page;
