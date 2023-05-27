import Link from "next/link";
import React, { useEffect, useState } from "react";

import { contractConfig, productCategory } from "utils/constants";

import { useContractWrite, usePrepareContractWrite } from "wagmi";

const nullProduct = {
  productId: "1",
  productName: productCategory[0],
  productPrice: "2",
};

const AddProduct = () => {
  const [addedProduct, setAddedProduct] = useState(nullProduct);

  const [contract, setContract] = useState();

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "addProduct",
    args: [
      parseInt(addedProduct.productId),
      addedProduct.productName,
      parseInt(addedProduct.productPrice),
    ],
  });

  const { write: addProduct, isLoading: addLoading } = useContractWrite({
    ...config,
    onError(error) {
      console.log("Error", error);
    },
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(addedProduct);
    if (
      addedProduct.productId &&
      addedProduct.productName &&
      addedProduct.productPrice
    ) {
      addProduct();
      setAddedProduct(nullProduct);
    } else {
      console.log("enter the arguments");
    }
  };

  const handleChange = (e) => {
    let name = e.target.name;
    setAddedProduct((prev) => {
      return { ...prev, [name]: e.target.value };
    });
  };

  return (
    <div className="w-full">
      <Link href="/profile">
        <span> +back to profile</span>
      </Link>

      <h3 className="text-xl font-medium mb-4 uppercase text-center">
        Add Product
      </h3>
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
          <label name="product__name">Product Category</label>
          {/* <input
            type="input"
            id="product__name"
            name="productName"
            onChange={handleChange}
            value={addedProduct.productName}
            className="w-2/4 border-gray-500 border rounded-md"
          />
          <br /> */}
          <select
            name="productName"
            onChange={handleChange}
            className="w-2/4 border-gray-500 border rounded-md"
          >
            {/* <option value="#">Select right Category</option> */}
            {productCategory.map((product, i) => {
              return (
                <option key={i + 1} value={product}>
                  {product}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex space-x-2">
          <label name="product__price">Product Price ETH: </label>
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
          add product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
