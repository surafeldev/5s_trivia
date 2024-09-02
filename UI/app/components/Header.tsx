import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TriviaAbi, TriviaContractAddress } from "../Blockchain/Contracts";
import { useConnect, useReadContract, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { data } = useReadContract({
    address: TriviaContractAddress,
    abi: TriviaAbi,
    functionName: "getUserBalance",
    args: [address],
  });

  const balance = data as BigInt;

  useEffect(() => {
    if (window.ethereum) {
      connect({ connector: injected() });
    }
  }, []);

  return (
    <div>
      {isConnected && (
        <div className=" flex  md:hidden justify-center">
          <ConnectButton />
        </div>
      )}
      <Link href="/">
        <header className="flex justify-between items-center p-4 bg-teal-500 text-white">
          <div className="text-2xl font-bold">
            {" "}
            <span className="text-4xl">5</span>sTrivia
          </div>
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {isConnected && (
            <div className="text-lg text-gray-700 bg-teal-200 px-2 py-1 rounded">
              Rewards: {Number(balance) / 10 ** 18} TRIVS
            </div>
          )}
        </header>
      </Link>
    </div>
  );
};

export default Header;
