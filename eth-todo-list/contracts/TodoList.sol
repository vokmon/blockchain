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

  // It will allow us to listen for these events inside client side applications
  event TaskCreated(
    uint id,
    string content,
    bool completed
  );

  function createTask(string memory _content) public {
    taskCount++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount, _content, false);
  }

  event TaskCompleted(
    uint id,
    bool completed
  );

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }
}