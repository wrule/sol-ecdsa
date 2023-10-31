import { ethers } from 'hardhat';
import { ContractEventPayload, Contract, ParamType } from 'ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { DeployContractOptions } from '@nomicfoundation/hardhat-ethers/types';

let signer: HardhatEthersSigner;
let otherSigners: HardhatEthersSigner[];

export
async function init() {
  [signer, ...otherSigners] = await ethers.getSigners();
}

export
function getSigner() { return signer; }

export
function getOtherSigners() { return otherSigners; }

export
function abiCallData(
  prototype: string,
  args: [string | ParamType, any][],
) {
  return ethers.keccak256(ethers.toUtf8Bytes(prototype)).slice(0, 10) +
    ethers.AbiCoder.defaultAbiCoder().encode(
      args.map((arg) => arg[0]),
      args.map((arg) => arg[1]),
    ).replace('0x', '');
}

export
function shortAddress(address: string) {
  return address.slice(0, 5) + '...' + address.slice(address.length - 3);
}

export
async function meta(address?: string) {
  console.log();
  address = address ?? signer.address;
  console.log(`<Meta ${shortAddress(address)}>`);
  const balance = ethers.formatEther(await signer.provider.getBalance(address));
  console.log(balance + 'ETH', address);
}

export
async function deployContract<T>(
  name: string,
  args?: any[],
  signerOrOptions?: HardhatEthersSigner | DeployContractOptions,
) {
  console.log();
  console.log('<DeployContract>');
  console.log(name, 'deployContract...');
  let contract = await ethers.deployContract(name, args ?? [], signerOrOptions);
  console.log(name, 'waitForDeployment...');
  contract = await contract.waitForDeployment();
  console.log(name, 'deployment successful!');
  console.log(name, 'contract address:', contract.target);
  return contract as T;
}

export
async function getContract<T>(name: string, address: string) {
  return await ethers.getContractAt(name, address, signer) as T;
}

export
async function watchContract(contract: Contract | any) {
  contract.on('*', (payload: ContractEventPayload) => {
    console.log(payload.fragment.name, payload.args);
  });
}

export
async function sendETH(address: string, amount: number) {
  console.log();
  console.log('<SendETH>');
  const key = amount.toString() + 'ETH';
  console.log(key, shortAddress(signer.address), 'to', shortAddress(address));
  console.log(key, 'sendTransaction...');
  const tx = await signer.sendTransaction({
    to: address,
    value: ethers.parseEther(amount.toString()),
  });
  console.log(key, 'wait...');
  await tx.wait();
  return tx;
}
