import { ethers, run } from "hardhat";

async function main() {
  const AAVE_POOL_ADDRESS_PROVIDER = "0x4CeDCB57Af02293231BAA9D39354D6BFDFD251e0"; // Amoyテストネット用のAaveプールアドレスプロバイダー

  console.log("Deploying FlashLoanArbitrage contract...");

  const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
  const flashLoanArbitrage = await FlashLoanArbitrage.deploy(AAVE_POOL_ADDRESS_PROVIDER);

  await flashLoanArbitrage.waitForDeployment();

  const address = await flashLoanArbitrage.getAddress();
  console.log("FlashLoanArbitrage deployed to:", address);

  // 検証のために30秒待機
  console.log("Waiting for 30 seconds before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));

  // コントラクトを検証
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [AAVE_POOL_ADDRESS_PROVIDER],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 