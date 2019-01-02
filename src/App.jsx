import React from "react";
import uuid from "uuid/v4";

const createTodo = title => ({
  id: uuid(),
  title,
  done: false
});

class App extends React.Component {
  state = {
    todos: [createTodo("Buy milk"), createTodo("Drink milk")],
    newTitle: ""
  };

  addTodo = () => {
    const { todos, newTitle } = this.state;
    this.setState({
      todos: [...todos, createTodo(newTitle)],
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
