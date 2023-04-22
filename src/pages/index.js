import { Inter } from "next/font/google";
import { useState } from "react";
import { contractAddress, ownerAddress } from "../../contractdetails";
import { ethers } from "ethers";

import SupplyChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";

const inter = Inter({ subsets: ["latin"] });

const nullProduct = {
  productId: "1",
  productName: "iphone13",
  productPrice: "20",
};

export default function Home({ name, Addedproducts }) {
  const [addedProduct, setAddedProduct] = useState(nullProduct);

  const addProductToSmartContract = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      const Contract = new ethers.Contract(
        contractAddress,
        SupplyChain.abi,
        signer
      );
      try {
        const response = await Contract.addProduct(
          parseInt(addedProduct.productId),
          addedProduct.productName,
          parseInt(addedProduct.productPrice)
        );
        console.log("conract deployed", response);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(addedProduct);
    if (
      addedProduct.productId &&
      addedProduct.productName &&
      addedProduct.productPrice
    ) {
      addProductToSmartContract();
      setAddedProduct(nullProduct);
    } else {
      console.log("entert the arguments");
    }
  };

  const handleChange = (e) => {
    let name = e.target.name;
    setAddedProduct((prev) => {
      return { ...prev, [name]: e.target.value };
    });
  };

  return (
    <main className="mx-2">
      <h1>This belongs to the {name} company</h1>
      <desc className="mb-5 block">
        We sell {name}`s and other things you would liek to buy hough
      </desc>
      <div className="w-full">
        <form
          className="flex flex-col mx-auto space-y-5"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex space-x-2">
            <label name="product__id">Product Id</label>
            <input
              type="input"
              id="product__id"
              name="productId"
              onChange={handleChange}
              value={addedProduct.productId}
              className="w-2/4 border-gray-500 border rounded-md"
            />
          </div>
          <div className="flex space-x-2">
            <label name="product__name">Product Name</label>
            <input
              type="input"
              id="product__name"
              name="productName"
              onChange={handleChange}
              value={addedProduct.productName}
              className="w-2/4 border-gray-500 border rounded-md"
            />
          </div>

          <div className="flex space-x-2">
            <label name="product__price">Product Price</label>
            <input
              type="input"
              id="product__price"
              name="productPrice"
              onChange={handleChange}
              value={addedProduct.productPrice}
              className="w-2/4 border-gray-500 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="border border-blue-500 py-2 px-4 bg-blue-500 mt-3 uppercase  rounded-md text-white w-[200px] mx-auto"
          >
            add products
          </button>
        </form>
      </div>
      <hr className="my-3" />
      <div className="text-center mt-3 text-xl">Added Products</div>
      {Addedproducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 ">
          {Addedproducts.map((product, i) => {
            return (
              <div
                className="border border-gray-500 px-5 py-5 rounded-sm hover:cursor-pointer hover:bg-gray-100 duration-150 hover:scale-105"
                key={i}
              >
                <div>id: {product.id}</div>
                <div> name:{product.productName}</div>
                <div className="">
                  owners:
                  {product.owners.map((owner, i) => (
                    <span className="block" key={i}>
                      {i + 1} - {owner.slice(0, 15)}...
                      {owner.slice(owner.length - 10)}{" "}
                    </span>
                  ))}
                </div>
                <div>available:{product.available ? "True" : "Talse"}</div>
                <div>price:{product.price}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <span>No prodicts already...</span>
      )}
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
