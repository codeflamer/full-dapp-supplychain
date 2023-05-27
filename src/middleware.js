import { ownerAddress } from "contractdetails";
import { NextResponse, NextRequest } from "next/server";

export function middleware(request) {
  console.log("New here", request);
  console.log(ownerAddress);

  //some logic here
  if (ownerAddress !== "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/profile/add-product",
};
