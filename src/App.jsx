import React from "react";
import uuid from "uuid/v4";
import AppoloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider, ApolloConsumer } from "react-apollo";

const client = new AppoloClient({
  uri: "https://fakerql.com/graphql"
});

const SHOW = {
  ALL: "ALL",
  NOT_DONE: "NOT_DONE"
};

class App extends React.Component {
  state = {
    filter: SHOW.ALL,
    todos: {
      [uuid()]: { text: "buy milk", done: false },
      [uuid()]: { text: "dring milk", done: false }
    },
    addText: ""
  };

  add = () => {
    const { todos, addText } = this.state;
    const todo = { [uuid()]: { text: addText, done: false } };
    this.setState({ todos: { ...todos, ...todo }, addText: "" });
  };

  remove = id => {
    const { todos } = this.state;
    delete todos[id];
    this.setState({ todos });
  };

  setDone = (id, done) => {
    const { todos } = this.state;
    const todo = { [id]: { ...todos[id], done } };
    this.setState({ todos: { ...todos, ...todo } });
  };

  onChangeFilter = evt => {
    this.setState({ filter: evt.target.value });
  };

  onChangeText = evt => {
    this.setState({ addText: evt.target.value });
  };

  render() {
    const { todos, filter, addText } = this.state;

    return (
      <div>
        <div>
          <select value={filter} onChange={this.onChangeFilter}>
            <option value={SHOW.ALL}>Show All</option>
            <option value={SHOW.NOT_DONE}>Show Not Done</option>
          </select>
        </div>
        <ul>
          {Object.keys(todos)
            .map(id => ({ id, ...todos[id] }))
            .filter(todo => filter === SHOW.ALL || !todo.done)
            .map(todo => (
              <li key={todo.id}>
                <label>
                  <input
                    type="checkbox"
                    value={todo.done}
                    onChange={() => this.setDone(todo.id, !todo.done)}
                  />
                  <span
                    style={{
                      "text-decoration": todo.done ? "line-through" : "none"
                    }}
                  >
                    {todo.text}
                  </span>
                </label>
                <button onClick={() => this.remove(todo.id)}>remove</button>
              </li>
            ))}
        </ul>
        <div>
          <input type="text" value={addText} onChange={this.onChangeText} />
          <button onClick={this.add}>Add</button>
        </div>
        <ApolloProvider client={client}>
          <h1>Apollo!!</h1>
          <ApolloConsumer>
            {client => {
              client
                .query({
                  query: gql`
                    {
                      allTodos {
                        id
                        title
                        completed
                      }
                    }
                  `
                })
                .then(result => console.log("result", result));
              return null;
            }}
          </ApolloConsumer>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
