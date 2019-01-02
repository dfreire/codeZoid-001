import React from "react";
import uuid from "uuid/v4";

class App extends React.Component {
  state = {
    todos: [
      {
        id: uuid(),
        title: "Buy milk"
      }
    ],
    newTitle: ""
  };

  addTodo = () => {
    const { todos, newTitle } = this.state;
    this.setState({
      todos: [...todos, { id: uuid(), title: newTitle }],
      newTitle: ""
    });
  };

  removeTodo = todo => {
    const { todos } = this.state;
    this.setState({
      todos: todos.filter(t => t.id !== todo.id)
    });
  };

  render() {
    const { todos, newTitle } = this.state;

    return (
      <div>
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={evt => this.setState({ newTitle: evt.target.value })}
          />
          <button onClick={this.addTodo}>Add</button>
        </div>
        <ul>
          {todos.map(todo => (
            <li>
              {todo.title}
              <button onClick={() => this.removeTodo(todo)}>remove</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
