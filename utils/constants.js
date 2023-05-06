import { contractAddress } from "contractdetails";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";

export const productCategory = ["categoryA", "categoryB"];

export const availabilityOptions = ["true", "false"];

export const contractConfig = {
  chainId: 31337,
  address: contractAddress,
  abi: SupplyChain.abi,
};
