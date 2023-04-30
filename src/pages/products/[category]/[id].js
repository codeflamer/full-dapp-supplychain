import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, ownerAddress } from "../../../../contractdetails";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { CreateContract } from "utils/CreateContract";

const availabilityOptions = ["true", "false"];

const Product = ({ name, product }) => {
  const [editPrice, setEditPrice] = useState(false);
  const [editAvailability, setEditAvailability] = useState(false);
  const [productAvailable, setProductAvailable] = useState(product.available);
  const [productPrice, setProductPrice] = useState(product.price);

  //Functions
  const handlePriceChange = (e) => {
    setProductPrice(e.target.value);
  };

  const handleAvailabilityChange = (e) => {
    setProductAvailable(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editAvailability) {
      console.log("productAvailable", productAvailable);
      const contract = CreateContract();
      try {
        const response = await contract.changeAvailability(
          product.productName,
          product.id,
          productAvailable === "true" ? true : false
        );
        console.log("response", response);
      } catch (e) {
        console.log(e);
      }
    }

    if (editPrice) {
      console.log("productPrice", productPrice);
      const contract = CreateContract();
      try {
        const response = await contract.changePrice(
          product.productName,
          product.id,
          parseInt(productPrice)
        );
        console.log("response", response);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <Link href="/products">
        <span>+back to product</span>
      </Link>
      <div className="border border-gray-500 px-5 py-5 rounded-md hover:cursor-pointer hover:bg-gray-100 duration-150  max-w-[500px] mx-auto">
        <Image
          className="rounded-md border w-full h-[200px]"
          width="300"
          height="200"
          alt="picture"
          src="https://media.istockphoto.com/id/1356372494/photo/newly-released-iphone-13-pro-mockup-set-with-back-and-front-angles.jpg?s=612x612&w=0&k=20&c=J8CFbAD3PDJzpzcnczS9IuzKf9qiLunsRKNNyz2Bnfs="
          priority
        />
        <section className="mt-2">
          <div>
            Product Name:{" "}
            <span className="uppercase">{product.productName}</span>
          </div>
          <div className="">
            Owners:
            {product.owners.map((owner, i) => (
              <span className="block" key={i}>
                {i + 1} - {owner.slice(0, 15)}...
                {owner.slice(owner.length - 10)}{" "}
              </span>
            ))}
          </div>
          <div>Available: {product.available ? "True" : "Talse"}</div>
          <div>Price: {product.price}</div>
          <div className="flex space-x-2 mt-2">
            {ownerAddress !== product.owners[product.owners.length - 1] ? (
              <Button name="Buy" />
            ) : (
              <>
                <Button
                  name="Edit Price"
                  handleClick={() => {
                    setEditAvailability(false);
                    setEditPrice(true);
                  }}
                />
                <Button
                  name="Edit Availability"
                  handleClick={() => {
                    setEditAvailability(true);
                    setEditPrice(false);
                  }}
                />
              </>
            )}
          </div>
        </section>
      </div>

      <section className="mt-4 ">
        {(editPrice || editAvailability) && (
          <form onSubmit={(e) => handleSubmit(e)}>
            {editPrice && (
              <>
                <label htmlFor="editPrice">Price In Eth:</label>
                <input
                  type="text"
                  name="editPrice"
                  id="editPrice"
                  className="border border-black flex w-full"
                  value={productPrice}
                  onChange={handlePriceChange}
                />
                <hr className="my-3 border" />
              </>
            )}

            {editAvailability && (
              <>
                <label htmlFor="editAvailability">Edit Availability:</label>
                <select
                  name="editAvailability"
                  onChange={handleAvailabilityChange}
                  className="w-2/4 border-gray-500 border rounded-md block"
                  value={productAvailable}
                  id="editAvailability"
                >
                  {/* <option value="#">Select right Category</option> */}
                  {availabilityOptions.map((opt, i) => {
                    return (
                      <option key={i + 1} value={opt}>
                        {opt}
                      </option>
                    );
                  })}
                </select>
              </>
            )}

            <Button name="Edit" type="submit" />
          </form>
        )}
      </section>
    </>
  );
};

export default Product;

export const getServerSideProps = async ({ params }) => {
  console.log("Params:", params.category);
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
  const name = await contract.companyName();

  const product = await contract.getProduct(
    parseInt(params.id),
    params.category
  );
  // console.log(product);

  const alteredProduct = {
    id: product.productId.toString(),
    productName: product.productName,
    owners: product.owners,
    available: product.available,
    price: product.price.toString(),
  };

  return {
    props: { name, product: alteredProduct },
  };
};
