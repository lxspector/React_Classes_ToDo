import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTodos, addTodo, deleteTodo, updateTodo } from './todosActions';
import DebouncedComponent from './DebouncedComponent';

class TodosComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodoText: '',
      searchTerm: '',
      sorted: false,
    };
  }

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/todos');
      const todos = await response.json();
      this.props.setTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  handleAddTodo = async () => {
    const { newTodoText } = this.state;
    if (newTodoText.trim()) {
      try {
        const response = await fetch('http://localhost:5000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTodoText }),
        });
        if (response.ok) {
          this.fetchTodos();
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
      this.setState({ newTodoText: '' });
    }
  };

  handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        this.fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  handleUpdateTodo = async (id, updatedText) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: updatedText }),
      });
      if (response.ok) {
        this.fetchTodos();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  setNewTodoText = (e) => {
    this.setState({ newTodoText: e.target.value });
  };

  handleSearchTermChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSortChange = () => {
    this.setState((prevState) => ({ sorted: !prevState.sorted }));
  };

  render() {
    const { newTodoText, searchTerm, sorted } = this.state;
    let { todos } = this.props;

    // Фильтрация и сортировка задач
    if (searchTerm) {
      todos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sorted) {
      todos = [...todos].sort((a, b) => a.title.localeCompare(b.title));
    }

    return (
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded"
            value={newTodoText}
            onChange={this.setNewTodoText}
            placeholder="Add new todo"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={this.handleAddTodo}
          >
            Add
          </button>
        </div>

        <div className="mb-4">
          <DebouncedComponent value={searchTerm} delay={300}>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded"
              onChange={(e) => this.setState({ searchTerm: e.target.value })}
              placeholder="Search todos"
            />
          </DebouncedComponent>
          <button
            className={`ml-2 py-2 px-4 rounded ${
              sorted
                ? 'bg-red-500 hover:bg-red-700'
                : 'bg-green-500 hover:bg-green-700'
            } text-white`}
            onClick={this.handleSortChange}
          >
            {sorted ? 'Unsort' : 'Sort'}
          </button>
        </div>

        <ul>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center border-b border-gray-300 py-2"
            >
              <span className="text-lg">{todo.title}</span>
              <div>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => this.handleUpdateTodo(todo.id, 'New Title')}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => this.handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  todos: state.todos.todos,
});

const mapDispatchToProps = (dispatch) => ({
  setTodos: (todos) => dispatch(setTodos(todos)),
  addTodo: (todo) => dispatch(addTodo(todo)),
  deleteTodo: (id) => dispatch(deleteTodo(id)),
  updateTodo: (todo) => dispatch(updateTodo(todo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodosComponent);
