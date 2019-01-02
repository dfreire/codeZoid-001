import React from "react";
import uuid from "uuid/v4";

class App extends React.Component {
  state = {
    todos: {
      [uuid()]: { text: "buy milk", done: false },
      [uuid()]: { text: "dring milk", done: false }
    },
    newText: ""
  };

  addTodo = () => {
    const { todos, newText } = this.state;
    const todo = { [uuid()]: { text: newText, done: false } };
    this.setState({ todos: { ...todos, ...todo }, newText: "" });
  };

  removeTodo = id => {
    const { todos } = this.state;
    delete todos[id];
    this.setState({ todos });
  };

  setDone = (id, done) => {
    const { todos } = this.state;
    const todo = { [id]: { ...todos[id], done } };
    this.setState({ todos: { ...todos, ...todo } });
  };

  render() {
    const { todos, newText } = this.state;

    return (
      <div>
        <div>
          <input
            type="text"
            value={newText}
            onChange={evt => this.setState({ newText: evt.target.value })}
          />
          <button onClick={this.addTodo}>Add</button>
        </div>
        <ul>
          {Object.keys(todos).map(id => {
            const { text, done } = todos[id];
            return (
              <li key={id}>
                <label>
                  <input
                    type="checkbox"
                    value={done}
                    onChange={() => this.setDone(id, !done)}
                  />
                  <span
                    style={{
                      "text-decoration": done ? "line-through" : "none"
                    }}
                  >
                    {text}
                  </span>
                </label>
                <button onClick={() => this.removeTodo(id)}>remove</button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default App;
