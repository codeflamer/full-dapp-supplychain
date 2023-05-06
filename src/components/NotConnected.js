import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

const NotConnected = () => {
  return (
    <div className="mt-10 flex flex-col justify-center items-center space-y-2">
      Connect To Wallet to explore
      <ConnectButton showBalance={false} className="mx-aut" />
    </div>
  );
};

export default NotConnected;
