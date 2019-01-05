import React from "react";
import uuid from "uuid/v4";
import AppoloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";

// change to force sync with github

const client = new AppoloClient({
  uri: "https://fakerql.com/graphql"
});

const queryAllTodos = gql`
  {
    allTodos {
      id
      title
      completed
    }
  }
`;

const SHOW = {
  TODO: "TODO",
  ALL: "ALL"
};

class App extends React.Component {
  state = {
    title: "",
    todos: {
      [uuid()]: { title: "buy milk", completed: false },
      [uuid()]: { title: "dring milk", completed: false }
    },
    data: undefined,
    filter: SHOW.TODO
  };

  add = () => {
    const { todos, title } = this.state;
    const todo = { [uuid()]: { title, completed: false } };
    this.setState({ todos: { ...todos, ...todo }, title: "" });
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
    this.setState({ title: evt.target.value });
  };

  render() {
    const { todos, filter, title, data } = this.state;

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
                    {todo.title}
                  </span>
                </label>
                <button onClick={() => this.remove(todo.id)}>remove</button>
              </li>
            ))}
        </ul>
        <div>
          <input type="title" value={title} onChange={this.onChangeText} />
          <button onClick={this.add}>Add</button>
        </div>
        <ApolloProvider client={client}>
          <h1>Apollo!!</h1>
          <Query query={queryAllTodos}>
            {({ data, loading, error }) => {
              if (error) {
                return <p>Error!</p>;
              } else if (loading) {
                return <p>Loading...</p>;
              }
              console.log("data.length", data.allTodos.length);
              return (
                <ul>
                  {data.allTodos
                    .filter(todo => filter === SHOW.ALL || !todo.completed)
                    .map(todo => (
                      <li key={todo.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() =>
                              this.setCompleted(todo.id, !todo.completed)
                            }
                          />
                          <span
                            style={{
                              "text-decoration": todo.completed
                                ? "line-through"
                                : "none"
                            }}
                          >
                            {todo.title}
                          </span>
                        </label>
                        <button onClick={() => this.remove(todo.id)}>
                          remove
                        </button>
                      </li>
                    ))}
                </ul>
              );
            }}
          </Query>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
