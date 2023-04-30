import { ethers } from "ethers";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { contractAddress, ownerAddress } from "../../contractdetails";

export const CreateContract = () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      contractAddress,
      SupplyChain.abi,
      signer
    );
    return contract;
  }
  return null;
};
