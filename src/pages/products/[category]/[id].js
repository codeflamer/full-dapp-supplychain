import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, ownerAddress } from "../../../../contractdetails";
import SupplyChain from "@/artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { convertToEth } from "helpers/myHelpers";
import { contractConfig } from "utils/constants";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

const availabilityOptions = ["true", "false"];

const Product = ({ name, product }) => {
  const router = useRouter();

  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(false);

  const [editPrice, setEditPrice] = useState(false);
  const [editAvailability, setEditAvailability] = useState(false);
  const [productAvailable, setProductAvailable] = useState(
    product.available ? "true" : "false"
  );
  const [productPrice, setProductPrice] = useState("20");

  //refreshdata
  const refreshData = () => {
    router.replace(router.asPath);
  };

  //wagmi buyProduct(string memory _productName, uint _productId)
  const { config: configBuy } = usePrepareContractWrite({
    chainId: 31337,
    address: contractAddress,
    abi: SupplyChain.abi,
    functionName: "buyProduct",
    args: [product.productName, parseInt(product.id)],
    overrides: {
      from: walletAddress,
      value: ethers.utils.parseEther(String(convertToEth(product.price))),
    },
  });

  const { config: configPrice } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "changePrice",
    args: [product.productName, product.id, parseInt(productPrice)],
  });

  const { config: configAvailability } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "changeAvailability",
    args: [
      product.productName,
      product.id,
      productAvailable === "true" ? true : false,
    ],
  });

  //Buy product
  const { write: buyProduct, isLoading: buyLoading } = useContractWrite({
    ...configBuy,

    onError(error) {
      console.log("Error", error);
      toast.error("An error occured");
    },
    onSuccess(data) {
      console.log("Success", data);
      refreshData();
      toast.success("Successfully Edited!");
    },
  });

  //Edit Price
  const { write: editProductPrice, isLoading: editingProductPrice } =
    useContractWrite({
      ...configPrice,

      onError(error) {
        console.log("Error", error);
        toast.error("An error occured");
      },
      onSuccess(data) {
        console.log("Success", data);
        refreshData();
        toast.success("Successfully Edited!");
      },
    });

  //Edit Availability
  const {
    write: editProductAvailability,
    isLoading: editingProductAvailability,
  } = useContractWrite({
    ...configAvailability,
    onError(error) {
      console.log("Error", error);
      toast.error("An error occured");
    },
    onSuccess(data) {
      console.log("Success", data);
      refreshData();
      toast.success("Successfully Bought!");
    },
  });

  const handlePriceChange = (e) => {
    console.log(e.target.value);
    setProductPrice(e.target.value);
  };

  const handleAvailabilityChange = (e) => {
    setProductAvailable(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editAvailability) {
      console.log("productAvailable", typeof productAvailable);
      editProductAvailability();
    }

    if (editPrice) {
      editProductPrice();
    }
  };

  useEffect(() => {
    setWalletAddress(address);
  }, [address]);

  useEffect(() => {
    setProductPrice(convertToEth(product.price));
  }, [product.price]);

  return (
    <>
      <Toaster />
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
          <div>Available: {product.available ? "True" : "False"}</div>
          <div>Price: {convertToEth(product.price)} ETH</div>
          <div className="flex space-x-2 mt-2">
            {walletAddress !== product.owners[product.owners.length - 1] ? (
              <Button
                name="Buy"
                handleClick={() => buyProduct?.()}
                disabled={buyLoading}
              />
            ) : (
              <>
                <Button
                  name="Edit Price"
                  disabled={editingProductPrice | editingProductAvailability}
                  handleClick={() => {
                    setEditAvailability(false);
                    setEditPrice(true);
                  }}
                />
                <Button
                  name="Edit Availability"
                  disabled={editingProductPrice | editingProductAvailability}
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
        <section>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                onClick={() => {
                  setEditAvailability(false);
                  setEditPrice(true);
                }}
                className="text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
              >
                Edit Price
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                  Edit Price
                </Dialog.Title>

                <fieldset className="mb-[15px] flex items-center gap-5 mt-3">
                  <label
                    className="text-violet11 w-[90px] text-right text-[15px]"
                    htmlFor="name"
                  >
                    Price (Eth):
                  </label>
                  <input
                    type="text"
                    name="editPrice"
                    id="editPrice"
                    className="border border-black inline-flex w-full"
                    value={productPrice}
                    onChange={handlePriceChange}
                  />
                </fieldset>

                <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                    <button
                      onClick={(e) => handleSubmit(e)}
                      disabled={
                        editingProductPrice | editingProductAvailability
                      }
                      type="submit"
                      className="bg-blue-400 text-white hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                    >
                      Edit
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                  >
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </section>
        {/* here */}

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

            <Button
              name="Edit"
              type="submit"
              disabled={editingProductPrice | editingProductAvailability}
            />
          </form>
        )}
      </section>
    </>
  );
};

export default Product;

export const getServerSideProps = async ({ params }) => {
  // console.log("Params:", params.category);
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
