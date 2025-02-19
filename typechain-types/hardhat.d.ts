/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IAuthentication",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAuthentication__factory>;
    getContractFactory(
      name: "ISignaturesValidator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISignaturesValidator__factory>;
    getContractFactory(
      name: "ITemporarilyPausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITemporarilyPausable__factory>;
    getContractFactory(
      name: "IWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IAuthorizer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAuthorizer__factory>;
    getContractFactory(
      name: "IFlashLoanRecipient",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFlashLoanRecipient__factory>;
    getContractFactory(
      name: "IProtocolFeesCollector",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IProtocolFeesCollector__factory>;
    getContractFactory(
      name: "IVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVault__factory>;
    getContractFactory(
      name: "IUniswapV2Router01",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router01__factory>;
    getContractFactory(
      name: "IUniswapV2Router02",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router02__factory>;
    getContractFactory(
      name: "IUniswapV3SwapCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV3SwapCallback__factory>;
    getContractFactory(
      name: "ISwapRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISwapRouter__factory>;
    getContractFactory(
      name: "FlashLoanArbitrage",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FlashLoanArbitrage__factory>;

    getContractAt(
      name: "IAuthentication",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAuthentication>;
    getContractAt(
      name: "ISignaturesValidator",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISignaturesValidator>;
    getContractAt(
      name: "ITemporarilyPausable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ITemporarilyPausable>;
    getContractAt(
      name: "IWETH",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IAuthorizer",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAuthorizer>;
    getContractAt(
      name: "IFlashLoanRecipient",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IFlashLoanRecipient>;
    getContractAt(
      name: "IProtocolFeesCollector",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IProtocolFeesCollector>;
    getContractAt(
      name: "IVault",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IVault>;
    getContractAt(
      name: "IUniswapV2Router01",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router01>;
    getContractAt(
      name: "IUniswapV2Router02",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router02>;
    getContractAt(
      name: "IUniswapV3SwapCallback",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV3SwapCallback>;
    getContractAt(
      name: "ISwapRouter",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISwapRouter>;
    getContractAt(
      name: "FlashLoanArbitrage",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FlashLoanArbitrage>;

    deployContract(
      name: "IAuthentication",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAuthentication>;
    deployContract(
      name: "ISignaturesValidator",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISignaturesValidator>;
    deployContract(
      name: "ITemporarilyPausable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ITemporarilyPausable>;
    deployContract(
      name: "IWETH",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IWETH>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IAuthorizer",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAuthorizer>;
    deployContract(
      name: "IFlashLoanRecipient",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFlashLoanRecipient>;
    deployContract(
      name: "IProtocolFeesCollector",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProtocolFeesCollector>;
    deployContract(
      name: "IVault",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IVault>;
    deployContract(
      name: "IUniswapV2Router01",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Router01>;
    deployContract(
      name: "IUniswapV2Router02",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Router02>;
    deployContract(
      name: "IUniswapV3SwapCallback",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV3SwapCallback>;
    deployContract(
      name: "ISwapRouter",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISwapRouter>;
    deployContract(
      name: "FlashLoanArbitrage",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FlashLoanArbitrage>;

    deployContract(
      name: "IAuthentication",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAuthentication>;
    deployContract(
      name: "ISignaturesValidator",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISignaturesValidator>;
    deployContract(
      name: "ITemporarilyPausable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ITemporarilyPausable>;
    deployContract(
      name: "IWETH",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IWETH>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IAuthorizer",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAuthorizer>;
    deployContract(
      name: "IFlashLoanRecipient",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFlashLoanRecipient>;
    deployContract(
      name: "IProtocolFeesCollector",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProtocolFeesCollector>;
    deployContract(
      name: "IVault",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IVault>;
    deployContract(
      name: "IUniswapV2Router01",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Router01>;
    deployContract(
      name: "IUniswapV2Router02",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Router02>;
    deployContract(
      name: "IUniswapV3SwapCallback",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV3SwapCallback>;
    deployContract(
      name: "ISwapRouter",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISwapRouter>;
    deployContract(
      name: "FlashLoanArbitrage",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FlashLoanArbitrage>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
