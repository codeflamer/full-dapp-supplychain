import ListProducts from "@/components/ListProducts";
import React from "react";
import { ethers } from "ethers";
import { contractAddress, ownerAddress } from "../../../contractdetails";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import Link from "next/link";
import Button from "@/components/Button";

const Profile = ({ name, Addedproducts }) => {
  return (
    <section>
      <h4>This is the profile page</h4>
      <h5>List of My products:</h5>
      <ListProducts Addedproducts={Addedproducts} />
      <Link href="/profile/add-product">
        <Button name="Add Product" />
      </Link>
    </section>
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
  let productIds = await contract.getIdsProduct("iphone13");
  productIds = productIds.map((productid) => {
    return productid.toString();
  });
  console.log(productIds);

  const responses = await Promise.all(
    productIds.map(async (productId) => {
      return await contract.getProduct(parseInt(productId), "iphone13");
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
