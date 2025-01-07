import { ethers, run } from "hardhat";

async function main() {
  try {
    // Amoyテストネット用のAaveプールアドレスプロバイダー
    const AAVE_POOL_ADDRESS_PROVIDER = "0x4CeDCB57Af02293231BAA9D39354D6BFDFD251e0";

    console.log("Deploying FlashLoanArbitrage contract...");
    console.log("Using Pool Address Provider:", AAVE_POOL_ADDRESS_PROVIDER);

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", await deployer.getAddress());
    const balance = await deployer.provider.getBalance(deployer.getAddress());
    console.log("Account balance:", balance.toString());

    if (balance.toString() === "0") {
      throw new Error("Deployer account has no balance");
    }

    const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
    console.log("Deploying contract...");

    // デプロイ前にガス見積もりを取得
    try {
      const deployTx = await FlashLoanArbitrage.getDeployTransaction(AAVE_POOL_ADDRESS_PROVIDER);
      const gasEstimate = await deployer.estimateGas(deployTx);
      console.log("Estimated deployment gas:", gasEstimate.toString());

      // ガス制限とガス価格を指定してデプロイ
      const flashLoanArbitrage = await FlashLoanArbitrage.deploy(
        AAVE_POOL_ADDRESS_PROVIDER,
        {
          gasLimit: Math.ceil(Number(gasEstimate) * 1.2), // 20%余裕を持たせる
          maxFeePerGas: ethers.parseUnits("100", "gwei"), // ガス価格の上限を設定
          maxPriorityFeePerGas: ethers.parseUnits("2", "gwei") // 優先手数料の上限を設定
        }
      );

      console.log("Waiting for deployment transaction...");
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
      } catch (error: any) {
        console.error("Error verifying contract:", error.message);
      }
    } catch (error: any) {
      console.error("Gas estimation or deployment failed:", error.message);
      if (error.error?.message) {
        console.error("Inner error:", error.error.message);
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Deployment failed with error:");
    console.error(error.message);
    if (error.error?.message) {
      console.error("Inner error message:", error.error.message);
    }
    if (error.data) {
      console.error("Error data:", error.data);
    }
    if (error.transaction) {
      console.error("Transaction:", error.transaction);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 