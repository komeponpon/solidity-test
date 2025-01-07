import { ethers } from "hardhat";

async function main() {
  // Polygon Amoy Testnet addresses
  const BALANCER_VAULT = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
  const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const SUSHISWAP_ROUTER = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";

  console.log("Deploying FlashLoanArbitrage contract...");

  const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
  const flashLoanArbitrage = await FlashLoanArbitrage.deploy(
    BALANCER_VAULT,
    UNISWAP_ROUTER,
    SUSHISWAP_ROUTER
  );

  await flashLoanArbitrage.waitForDeployment();

  const address = await flashLoanArbitrage.getAddress();
  console.log(`FlashLoanArbitrage deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 