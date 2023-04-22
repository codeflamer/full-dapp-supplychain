const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy("iPhone");

  await supplyChain.deployed();

  console.log("Contract Address:", supplyChain.address);
  console.log("Address of Deployer:", supplyChain.signer.address);
  fs.writeFileSync(
    "./contractdetails.js",
    `
  export const contractAddress = "${supplyChain.address}"
  export const ownerAddress = "${supplyChain.signer.address}"
  `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
