import React, { Component } from 'react';
import TodosComponent from './TodosComponent';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Todo List</h1>
        <TodosComponent />
      </div>
    );
  }
}

export default App;
