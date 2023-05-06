import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <>
      <nav className="mt-3 border-b-2 pb-4 mb-3">
        <div className="flex justify-between mx-10 items-center">
          <div className="">
            <Link href="/">Decentralised Supply Chain</Link>
          </div>
          <div className="space-x-2">
            <Link href="/profile">Profile</Link>
            <Link href="/products">Products</Link>
          </div>
          <div>
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;

{
  /* <div>
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
          </div> */
}
