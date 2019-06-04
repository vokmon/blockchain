pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 1;

  function getTaskCount() public view returns(uint) {
    return taskCount;
  }
}