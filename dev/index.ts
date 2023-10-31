import { ethers } from 'hardhat';
import { X } from '../typechain-types';
import { deployContract, getSigner, init, meta, watchContract } from './utils';


async function getTicket(amount: bigint) {
  const data = ethers.solidityPacked(['uint256'], [amount]);
  const hash = ethers.solidityPackedKeccak256(['uint256'], [amount]);
  const signature = await getSigner().signMessage(ethers.getBytes(hash));
  return data + signature.replace('0x', '');
}

async function main() {
  await meta();
  const x = await deployContract<X>('X');
  watchContract(x);
  let ticket = await getTicket(198n);
  // ticket = ticket.replace('6e', '1f');
  await x.redeemTicket(ticket);
}

async function dev() {
  await init();
  main();
}

dev();
