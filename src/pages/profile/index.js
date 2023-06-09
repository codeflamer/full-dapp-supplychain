import ListProducts from "@/components/ListProducts";
import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, ownerAddress } from "../../../contractdetails";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import Link from "next/link";
import Button from "@/components/Button";
import { useAccount } from "wagmi";
import NotConnected from "@/components/NotConnected";
import SearchBar from "@/components/SearchBar";

const Profile = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [connected, setConnected] = useState();

  //search values
  const [searchValue, setSearchValue] = useState(null);
  const [productData, setProductData] = useState(null);

  const handleFetchData = useCallback(async () => {
    let provider;
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "local") {
      provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet") {
      provider = new ethers.providers.JsonRpcProvider(
        "https://rpc-mumbai.matic.today"
      );
    } else {
      provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com/"
      );
    }

    const contract = new ethers.Contract(
      contractAddress,
      SupplyChain.abi,
      provider
    );
    const data = await contract.companyName();
    // let productIds = await contract.getIdsProduct("categoryA");
    let productIds = await contract.getAllProductIdsForAnAddress(
      address,
      "categoryA"
    );
    productIds = productIds.map((productid) => {
      return productid.toString();
    });

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
    return { convertedResponses, data };
  }, [address]);

  //prev.filter(product) => product.id!=searchValue

  const handleSearch = () => {
    console.log("clicking", searchValue);
    if (!searchValue) {
      return setAddedProducts(productData);
    }
    setAddedProducts((prev) => {
      return productData.filter((product) => product.id == searchValue);
    });
  };

  useEffect(() => {
    if (isConnected) {
      (async () => {
        setLoading(true);
        const result = await handleFetchData();
        setAddedProducts(result.convertedResponses);
        setProductData(result.convertedResponses);
        setName(result.name);
        setLoading(false);
      })();
    } else {
      setAddedProducts([]);
      setName("");
    }
    setConnected(isConnected);
  }, [isConnected, handleFetchData]);

  return (
    <>
      <section>
        {connected ? (
          loading ? (
            "Loading ..."
          ) : (
            <>
              <h4 className="font-bold text-[30px] text-center">
                This is the profile page
              </h4>
              <div className="flex flex-col items-center mt-5">
                <SearchBar
                  setSearchValue={setSearchValue}
                  handleSearch={handleSearch}
                  searchValue={searchValue}
                />
              </div>
              <h5 className="mt-2 font-bold text-[20px]">
                List of My products:
              </h5>
              <ListProducts Addedproducts={addedProducts} />
              {address == ownerAddress ? (
                <Link href="/profile/add-product">
                  <Button
                    name="Add Product"
                    className="mt-2"
                    //handleClick={handleClick}
                  />
                </Link>
              ) : null}
            </>
          )
        ) : (
          <NotConnected />
        )}
      </section>
    </>
  );
};

export default Profile;

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
  // let productIds = await contract.getIdsProduct("categoryA");
  let productIds = await contract.getAllProductIdsForAnAddress(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "categoryA"
  );
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
