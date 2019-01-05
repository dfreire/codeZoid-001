import React from "react";
import uuid from "uuid/v4";
import AppoloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";

const client = new AppoloClient({
  uri: "https://fakerql.com/graphql"
});

const SHOW = {
  TODO: "TODO",
  ALL: "ALL"
};

class App extends React.Component {
  state = {
    filter: SHOW.TODO,
    todos: {
      [uuid()]: { text: "buy milk", completed: false },
      [uuid()]: { text: "dring milk", completed: false }
    },
    addText: ""
  };

  add = () => {
    const { todos, addText } = this.state;
    const todo = { [uuid()]: { text: addText, completed: false } };
    this.setState({ todos: { ...todos, ...todo }, addText: "" });
  };

  remove = id => {
    const { todos } = this.state;
    delete todos[id];
    this.setState({ todos });
  };

  setCompleted = (id, completed) => {
    const { todos } = this.state;
    const todo = { [id]: { ...todos[id], completed } };
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
            <option value={SHOW.TODO}>Show TODO</option>
            <option value={SHOW.ALL}>Show All</option>
          </select>
        </div>
        <ul>
          {Object.keys(todos)
            .map(id => ({ id, ...todos[id] }))
            .filter(todo => filter === SHOW.ALL || !todo.completed)
            .map(todo => (
              <li key={todo.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => this.setCompleted(todo.id, !todo.completed)}
                  />
                  <span
                    style={{
                      "text-decoration": todo.completed
                        ? "line-through"
                        : "none"
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
          <Query
            query={gql`
              {
                allTodos {
                  id
                  title
                  completed
                }
              }
            `}
          >
            {({ data }) => {
              console.log("data", data);
              return <h2>Data</h2>;
            }}
          </Query>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
