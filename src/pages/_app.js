import "@/styles/globals.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from "react";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  const [account, setAccount] = useState(null);

  const getWeb3Modal = async () => {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "7089e738791b44d5930899927c9d4cd1",
          },
        },
      },
    });
    return web3Modal;
  };

  const connect = async () => {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log("error:", err);
    }
  };

  return (
    <div>
      <nav className=" mt-3 border-b-2 pb-4 mb-3">
        <div className="flex justify-between mx-10 items-center">
          <div className="">
            <Link href="/">Decentralised Supply Chain</Link>
          </div>
          <div className="space-x-2">
            <Link href="/profile">Profile</Link>
            <Link href="/products">Products</Link>
          </div>
          <div>
            {!account ? (
              <div>
                <button
                  onClick={connect}
                  className="border border-blue-500 py-2 px-4 bg-blue-500  uppercase rounded-md text-white"
                >
                  Connect
                </button>
              </div>
            ) : (
              <p>{account}</p>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-2">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
