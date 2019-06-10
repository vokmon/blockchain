import React, { Component } from 'react';


class TodoList extends Component {

  onSubmit = (event) => {
    event.preventDefault();
    console.log(this.task.value);
    this.props.createTask(this.task.value);
  }
  
  populateTask = (input) => {
    this.task = input;
  }

  render() {
    return(
      <div id="content">
        <form onSubmit={this.onSubmit}>
          <input id="newTask" ref={this.populateTask} type="text" className="form-control" placeholder="Add task..." required />
          <input type="submit" hidden={true} />
        </form>
        <ul id="taskList" className="list-unstyled">
          { this.props.tasks.map((task, key) => {
            return(
              <div className="taskTemplate"  key={key}>
                <label>
                  <input type="checkbox" />
                  <span className="content">{task.content}</span>
                </label>
              </div>
            );
          })}
        </ul>
        <ul id="completedTaskList" className="list-unstyled">
        </ul>
      </div>
    );
  }
}

export default TodoList;