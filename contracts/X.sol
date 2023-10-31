// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract X is Ownable {
  constructor() Ownable(msg.sender) { }

  mapping(bytes => bool) tickets;

  error _checkTicketError(string message);
  function _checkTicket(bytes calldata ticket) internal view {
    if (tickets[ticket])
      revert _checkTicketError("ticket has been redeemed");
    bytes memory amount = ticket[:32];
    bytes memory signature = ticket[32:];
    address sigAddr = ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(keccak256(amount)), signature);
    if (sigAddr != owner())
      revert _checkTicketError("ticket is invalid");
  }

  modifier validTicket(bytes calldata ticket) {
    _checkTicket(ticket);
    _;
  }

  event redeemTicketEvent(uint256 amount);
  function redeemTicket(bytes calldata ticket) external validTicket(ticket) {
    uint256 amount = uint256(bytes32(ticket[:32]));
    emit redeemTicketEvent(amount);
  }

  function recoverx(bytes calldata ticket) public pure returns (address) {
    bytes32 hash = bytes32(ticket[:32]);
    bytes memory signature = ticket[32:];
    return ECDSA.recover(hash, signature);
  }

  event sendMessageEvent(string message);
  function sendMessage(string memory message) public {
    emit sendMessageEvent(message);
  }

  event fallbackEvent(address sender, uint value, bytes data);
  fallback() external payable {
    emit fallbackEvent(msg.sender, msg.value, msg.data);
  }

  event receiveEvent(address sender, uint value);
  receive() external payable {
    emit receiveEvent(msg.sender, msg.value);
  }
}
