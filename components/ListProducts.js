import Link from "next/link";
import React from "react";

const ListProducts = ({ Addedproducts, category }) => {
  return (
    <>
      {Addedproducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 space-y-2">
          {Addedproducts.map((product, i) => {
            return (
              <Link
                key={i}
                href={`products/${product.productName}/${product.id}`}
              >
                <div
                  key={i}
                  className=" border border-gray-500 px-5 py-5 rounded-sm hover:cursor-pointer hover:bg-gray-100 duration-150 hover:scale-105 "
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
              </Link>
            );
          })}
        </div>
      ) : (
        <span>No prodicts already...</span>
      )}
    </>
  );
};

export default ListProducts;
