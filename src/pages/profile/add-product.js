import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CreateContract } from "utils/CreateContract";
import { productCategory } from "utils/constants";

const nullProduct = {
  productId: "1",
  productName: "categoryA",
  productPrice: "20",
};

const AddProduct = () => {
  const [addedProduct, setAddedProduct] = useState(nullProduct);
  const [contract, setContract] = useState();

  const addProductToSmartContract = async () => {
    console.log(contract);
    if (contract) {
      try {
        const response = await contract.addProduct(
          parseInt(addedProduct.productId),
          addedProduct.productName,
          parseInt(addedProduct.productPrice)
        );
        console.log("conract deployed", response);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Check if you have metamask installed!!");
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

  useEffect(() => {
    setContract(CreateContract());
  }, []);

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
          add product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
