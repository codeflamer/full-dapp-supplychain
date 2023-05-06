import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Nav from "@/components/Nav";

export default function App({ Component, pageProps }) {
  const localhostChain = {
    id: 31337,
    name: "Localhost 8545",
    network: "hadrhat",
    iconUrl: "https://example.com/icon.svg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Ethereum",
      symbol: "ETH",
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
    testnet: false,
  };

  const { chains, provider } = configureChains(
    [localhostChain, goerli],
    [
      jsonRpcProvider({
        rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
      }),
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "SupplyChain App",
    projectId: "7089e738791b44d5930899927c9d4cd1",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Nav />
        <div className="mx-2">
          <Component {...pageProps} />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

// const [account, setAccount] = useState(null);

//   const getWeb3Modal = async () => {
//     const web3Modal = new Web3Modal({
//       cacheProvider: false,
//       providerOptions: {
//         walletconnect: {
//           package: WalletConnectProvider,
//           options: {
//             infuraId: "7089e738791b44d5930899927c9d4cd1",
//           },
//         },
//       },
//     });
//     return web3Modal;
//   };

//   const connect = async () => {
//     try {
//       const web3Modal = await getWeb3Modal();
//       const connection = await web3Modal.connect();
//       const provider = new ethers.providers.Web3Provider(connection);
//       const accounts = await provider.listAccounts();
//       setAccount(accounts[0]);
//     } catch (err) {
//       console.log("error:", err);
//     }
//   };
