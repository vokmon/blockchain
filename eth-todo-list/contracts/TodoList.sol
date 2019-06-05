pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    // unique id of the struct
    uint id;

    // text of task
    string content;

    // status of the task
    // true -> complete/finished
    // false -> unfishied task
    bool completed;
  }

  // storage on the blockchain
  mapping(uint => Task) public tasks;

  constructor() public {
    // default task to do
    createTask("Check out dappuniversity.com");
  }

  function createTask(string memory _content) public {
    taskCount++;
    tasks[taskCount] = Task(taskCount, _content, false);
  }
}