import { contractAddress } from "contractdetails";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";

export const productCategory = ["categoryA", "categoryB"];

export const contractConfig = {
  chainId: 31337,
  address: contractAddress,
  abi: SupplyChain.abi,
};
