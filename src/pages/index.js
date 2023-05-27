import { Inter } from "next/font/google";
import { contractAddress, ownerAddress } from "../../contractdetails";
import { ethers } from "ethers";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";

import * as Popover from "@radix-ui/react-popover";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ name }) {
  return (
    <main>
      <h1 className="text-center text-3xl font-bold mb-4">
        This belongs to the {name} company
      </h1>
      <section className="mb-5 block mx-auto max-w-2xl text-center text-xl">
        We all gather to, the buyer the sellers and others to create a Beautiful
        experience for wholesalers retailers
      </section>
    </main>
  );
}

export const getServerSideProps = async () => {
  let provider;
  if (process.env.ENVIRONMENT === "local") {
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
  } else if (process.env.ENVIRONMENT === "testnet") {
    provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  }

  const contract = new ethers.Contract(
    contractAddress,
    SupplyChain.abi,
    provider
  );
  const data = await contract.companyName();

  return {
    props: {
      name: data,
    },
  };
};
