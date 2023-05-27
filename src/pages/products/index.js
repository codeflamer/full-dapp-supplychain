import React, { useEffect, useState } from "react";
import ListProducts from "@/components/ListProducts";
import { contractAddress, ownerAddress } from "../../../contractdetails";
import { ethers } from "ethers";

import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SearchBar from "@/components/SearchBar";

const Products = ({ name, Addedproducts }) => {
  const { isConnected } = useAccount();

  const [products, setProducts] = useState(Addedproducts);
  const [connected, setConnected] = useState();

  //search values
  const [searchValue, setSearchValue] = useState(null);
  const [productData, setProductData] = useState(Addedproducts);

  const handleSearch = () => {
    console.log("clicking", searchValue);
    if (!searchValue) {
      return setProducts(productData);
    }
    setProducts((prev) => {
      return productData.filter((product) => product.id == searchValue);
    });
  };

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  return (
    <>
      <h3 className="font-medium text-xl mb-2 text-center">
        This is a List of products belonging to{" "}
        <span className="italic">{name}</span>
      </h3>
      <div className="flex flex-col items-center mt-5">
        <SearchBar
          setSearchValue={setSearchValue}
          handleSearch={handleSearch}
          searchValue={searchValue}
        />
      </div>
      {connected ? (
        <div className="">
          <ListProducts Addedproducts={products} />
        </div>
      ) : (
        <div className="mt-10 flex flex-col justify-center items-center space-y-2">
          You are not Connected To a wallet
          <ConnectButton showBalance={false} className="mx-aut" />
        </div>
      )}
    </>
  );
};

export default Products;

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

  let productIds = await contract.getIdsProduct("categoryA");
  productIds = productIds.map((productid) => {
    return productid.toString();
  });
  console.log(productIds);

  const responses = await Promise.all(
    productIds.map(async (productId) => {
      return await contract.getProduct(parseInt(productId), "categoryA");
    })
  );

  const convertedResponses = responses.map((response) => {
    return {
      id: response.productId.toString(),
      productName: response.productName,
      owners: response.owners,
      available: response.available,
      price: response.price.toString(),
    };
  });

  console.log(convertedResponses);

  return {
    props: {
      name: data,
      Addedproducts: convertedResponses,
    },
  };
};
