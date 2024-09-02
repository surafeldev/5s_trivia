import React from "react";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { TriviaAbi, TriviaContractAddress } from "../Blockchain/Contracts";
// import { connect } from 'wagmi/actions';
import { injected } from "wagmi/connectors";
import { toast } from 'sonner';


const Reward = () => {
  const { connect } = useConnect();

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const reward = async () => {
    if (isConnected) {
      const tx = await writeContractAsync({
        address: TriviaContractAddress,
        abi: TriviaAbi,
        functionName: "rewardUser",
        args: [address],
      });
      console.log(tx);
      if(tx){
        toast("claimed successfully");

      }else{
        toast("unable to claim");
      }
    } else {
      connect({ connector: injected()});
    }
  };

  return (
    <div>
      <button onClick={reward} className="px-4 py-2 bg-teal-500 text-white rounded mt-4">
        Claim Reward
      </button>
    </div>
  );
};

export default Reward;
